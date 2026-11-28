"""Gera o catálogo local usando a planilha ODS contida no ZIP oficial."""
import argparse
import hashlib
import io
import json
import re
import xml.etree.ElementTree as ET
from datetime import date
from pathlib import Path
from zipfile import ZipFile

UFS = dict(zip(
    "11 12 13 14 15 16 17 21 22 23 24 25 26 27 28 29 31 32 33 35 41 42 43 50 51 52 53".split(),
    "RO AC AM RR PA AP TO MA PI CE RN PB PE AL SE BA MG ES RJ SP PR SC RS MS MT GO DF".split(),
    strict=True,
))
SOURCE = "https://geoftp.ibge.gov.br/organizacao_do_territorio/estrutura_territorial/divisao_territorial/2025/DTB_2025.zip"
TABLE = "RELATORIO_DTB_BRASIL_2025_MUNICIPIOS.ods"
TABLE_NS = "{urn:oasis:names:tc:opendocument:xmlns:table:1.0}"
EXPECTED_COUNT = 5571


def cells(row):
    values = []
    for cell in row:
        repeat = int(cell.get(TABLE_NS + "number-columns-repeated", "1"))
        values.extend(["".join(cell.itertext())] * min(repeat, 9 - len(values)))
        if len(values) == 9:
            break
    return values


def compact(value):
    return json.dumps(value, ensure_ascii=False, separators=(",", ":"))


def generate(archive, retrieved):
    with ZipFile(io.BytesIO(archive)) as release:
        with ZipFile(io.BytesIO(release.read(TABLE))) as ods:
            root = ET.fromstring(ods.read("content.xml"))
    rows = iter(root.findall(f".//{TABLE_NS}table/{TABLE_NS}table-row"))
    for row in rows:
        row_cells = cells(row)
        if row_cells[-2:] == ["Código Município Completo", "Nome_Município"]:
            break
    else:
        raise ValueError("Cabeçalho municipal ausente")

    records = {}
    for row in rows:
        values = cells(row)
        if not any(values):
            continue
        if len(values) != 9 or int(row.get(TABLE_NS + "number-rows-repeated", "1")) != 1:
            raise ValueError(f"Linha municipal incompleta ou repetida: {values}")
        uf_code, *_, code, name = values
        if (uf_code not in UFS or not re.fullmatch(r"[0-9]{7}", code)
                or not code.startswith(uf_code) or code in records or not name.strip()):
            raise ValueError(f"Linha municipal inválida: {values}")
        records[code] = [code, name, UFS[uf_code]]
    if len(records) != EXPECTED_COUNT or {row[2] for row in records.values()} != set(UFS.values()):
        raise ValueError(f"Quantidade ou cobertura divergente: {len(records)} registros")
    for code in ("5300108", "2605459", "5101837"):
        if code not in records:
            raise ValueError(f"Código esperado ausente: {code}")

    metadata = {
        "source": SOURCE,
        "edition": "DTB 2025",
        "referenceDate": "2025-12-31",
        "retrievedAt": retrieved.isoformat(),
        "sourceSha256": hashlib.sha256(archive).hexdigest(),
        "table": TABLE,
        "generator": "scripts/generate-municipalities.py",
        "count": len(records),
        "usage": "Dados públicos do IBGE. Creditar IBGE, Divisão Territorial Brasileira 2025.",
    }
    return metadata, [records[code] for code in sorted(records)]


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("archive", type=Path)
    parser.add_argument("--retrieved", type=date.fromisoformat, required=True)
    args = parser.parse_args()
    metadata, records = generate(args.archive.read_bytes(), args.retrieved)
    output = Path(__file__).resolve().parents[1] / "src/data/municipalities.json"
    output.write_text(
        '{"metadata":' + compact(metadata) + ',\n"municipalities":[\n'
        + ",\n".join(map(compact, records)) + "\n]}\n",
        encoding="utf-8",
    )
