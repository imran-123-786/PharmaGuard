def parse_vcf(vcf_text: str):
    variants = []

    for line in vcf_text.splitlines():
        if line.startswith("#"):
            continue

        fields = line.split("\t")
        info = fields[7]

        gene = rsid = star = None
        for item in info.split(";"):
            if item.startswith("GENE="):
                gene = item.split("=")[1]
            elif item.startswith("RS="):
                rsid = item.split("=")[1]
            elif item.startswith("STAR="):
                star = item.split("=")[1]

        if gene:
            variants.append({
                "gene": gene,
                "rsid": rsid,
                "star": star
            })

    return variants
