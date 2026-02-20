from md2pdf.core import md2pdf
import os

# Convert both markdown files to PDF
files = [
    ("docs/pricewise_issues_faced.md", "docs/pricewise_issues_faced.pdf"),
    ("docs/pricewise_complete_documentation.md", "docs/pricewise_complete_documentation.pdf")
]

for md_file, pdf_file in files:
    print(f"Converting {md_file} to {pdf_file}...")
    
    try:
        md2pdf(
            pdf_file_path=pdf_file,
            md_file_path=md_file,
            base_url=None
        )
        print(f"Successfully created {pdf_file}")
    except Exception as e:
        print(f"Error converting {md_file}: {e}")

print("\nConversion complete!")
