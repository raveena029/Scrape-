import pdfplumber
import pandas as pd
import re
import os
from tabulate import tabulate
from typing import List, Dict, Any

def validate_pdf_path(pdf_path):
    """Validate and format the PDF file path"""
    pdf_path = pdf_path.strip('"\'')
    pdf_path = os.path.normpath(pdf_path)
    
    if not os.path.exists(pdf_path):
        raise FileNotFoundError(f"PDF file not found at: {pdf_path}")
    
    if not pdf_path.lower().endswith('.pdf'):
        raise ValueError("File must be a PDF document")
    
    return pdf_path

def is_heading(text, font_size, avg_font_size):
    """Determine if text is likely a heading based on font size and formatting"""
    if not text.strip():
        return False
    
    is_larger_font = font_size > avg_font_size
    is_title_format = text.isupper() or text.istitle()
    has_section_number = bool(re.match(r'.*?[\d\.]+\s*$', text))
    is_reasonable_length = len(text.split()) <= 15
    
    return (is_larger_font or is_title_format or has_section_number) and is_reasonable_length

def extract_page_elements(page):
    """Extract both text and table elements with their positions"""
    elements = []
    
    # Extract words with position
    words = page.extract_words(extra_attrs=['size'])
    current_line = []
    current_y = None
    
    for word in words:
        if current_y is None:
            current_y = word['top']
        
        if abs(word['top'] - current_y) > 2:
            if current_line:
                text = ' '.join(word['text'] for word in current_line)
                elements.append({
                    'type': 'text',
                    'content': text,
                    'position': current_y,
                    'font_size': current_line[0].get('size', 12)
                })
            current_line = []
            current_y = word['top']
        
        current_line.append(word)
    
    # Add the last line
    if current_line:
        text = ' '.join(word['text'] for word in current_line)
        elements.append({
            'type': 'text',
            'content': text,
            'position': current_y,
            'font_size': current_line[0].get('size', 12)
        })
    
    # Extract tables with position
    tables = page.find_tables()
    for table in tables:
        table_data = table.extract()
        if table_data and any(any(cell for cell in row) for row in table_data):
            elements.append({
                'type': 'table',
                'content': table_data,
                'position': table.bbox[1]  # y position of table top
            })
    
    # Sort elements by position
    return sorted(elements, key=lambda x: x['position'])

def format_table(table_data):
    """Format table data into a readable string"""
    if not table_data or not any(table_data):
        return "Empty table"
    
    # Clean and prepare data
    cleaned_data = []
    for row in table_data:
        cleaned_row = []
        for cell in row:
            if cell is None:
                cleaned_cell = ""
            else:
                cleaned_cell = str(cell).strip()
                cleaned_cell = re.sub(r'\s+', ' ', cleaned_cell)
            cleaned_row.append(cleaned_cell)
        cleaned_data.append(cleaned_row)
    
    # Create DataFrame and format
    headers = cleaned_data[0]
    df = pd.DataFrame(cleaned_data[1:], columns=headers)
    
    return tabulate(
        df,
        headers=headers,
        tablefmt='grid',
        showindex=False,
        maxcolwidths=[None] * len(headers)
    )

def extract_pdf_content(pdf_path):
    """Extract structured content from PDF"""
    try:
        pdf_path = validate_pdf_path(pdf_path)
        content = []
        all_font_sizes = []
        
        with pdfplumber.open(pdf_path) as pdf:
            print(f"\nAnalyzing PDF structure...")
            
            # First pass - collect font sizes
            for page in pdf.pages:
                for word in page.extract_words(extra_attrs=['size']):
                    if 'size' in word:
                        all_font_sizes.append(word['size'])
            
            avg_font_size = sum(all_font_sizes) / len(all_font_sizes) if all_font_sizes else 12
            
            # Second pass - extract content
            for page_num, page in enumerate(pdf.pages, 1):
                print(f"\rProcessing page {page_num}/{len(pdf.pages)}", end="")
                
                # Get all elements in order
                elements = extract_page_elements(page)
                
                # Process elements
                processed_elements = []
                for element in elements:
                    if element['type'] == 'text':
                        processed_elements.append({
                            'type': 'text',
                            'content': element['content'],
                            'position': element['position'],
                            'is_heading': is_heading(element['content'], 
                                                   element['font_size'], 
                                                   avg_font_size)
                        })
                    else:  # table
                        processed_elements.append({
                            'type': 'table',
                            'content': element['content'],
                            'position': element['position'],
                            'is_heading': False
                        })
                
                content.append({
                    'page': page_num,
                    'elements': processed_elements
                })
            
            print("\nPDF structure analysis completed!")
        return content
    except Exception as e:
        print(f"\nError during PDF processing: {str(e)}")
        return None

def find_section_content(content, topic):
    """Find all content (text and tables) under a specific section heading"""
    results = {
        'text': [],
        'tables': [],
        'pages': set(),
        'section_heading': None
    }
    
    topic_pattern = re.compile(topic, re.IGNORECASE)
    in_section = False
    
    for page_data in content:
        elements = page_data['elements']
        
        for i, element in enumerate(elements):
            # Check for section heading
            if element['type'] == 'text' and element['is_heading']:
                if not in_section and topic_pattern.search(element['content']):
                    # Found our section
                    in_section = True
                    results['section_heading'] = element['content']
                    results['pages'].add(page_data['page'])
                    continue
                elif in_section:
                    # Found next heading, stop collecting
                    in_section = False
                    break
            
            # Collect content if we're in our section
            if in_section:
                if element['type'] == 'text' and not element['is_heading']:
                    results['text'].append(element['content'])
                elif element['type'] == 'table':
                    results['tables'].append(format_table(element['content']))
                results['pages'].add(page_data['page'])
    
    return results

def main():
    try:
        # Get PDF path from user
        pdf_path = input("Enter the path to your PDF file: ")
        
        # Extract structured content
        content = extract_pdf_content(pdf_path)
        if not content:
            return
        
        while True:
            # Get topic from user
            topic = input("\nEnter the section heading to search for (or 'quit' to exit): ").strip()
            if topic.lower() == 'quit':
                break
            if not topic:
                print("Please enter a valid topic")
                continue
            
            # Search for section content
            results = find_section_content(content, topic)
            
            if not results['text'] and not results['tables']:
                print(f"\nNo section found with heading matching: {topic}")
                continue
            
            # Print results
            if results['section_heading']:
                print(f"\nFound section: {results['section_heading']}")
                print(f"On pages: {sorted(results['pages'])}")
                
                print("\nSection content:")
                print("-" * 80)
                
                # Print content and tables in their original order
                for text in results['text']:
                    print(text)
                    print()
                
                if results['tables']:
                    print("\nTables in this section:")
                    for i, table in enumerate(results['tables'], 1):
                        print(f"\nTable {i}:")
                        print(table)
                        print()
                
                # Calculate word count
                total_words = sum(len(text.split()) for text in results['text'])
                print(f"\nTotal word count in section: {total_words}")
                
                # Ask if user wants to count specific words
                while True:
                    word_to_count = input("\nEnter a word to count its occurrences (or press Enter to skip): ").strip()
                    if not word_to_count:
                        break
                    count = sum(len(re.findall(r'\b' + re.escape(word_to_count) + r'\b', text, re.IGNORECASE)) 
                              for text in results['text'])
                    print(f"The word '{word_to_count}' appears {count} times in this section.")
            
    except KeyboardInterrupt:
        print("\n\nProgram terminated by user.")
    except Exception as e:
        print(f"\nAn unexpected error occurred: {str(e)}")

if __name__ == "__main__":
    main()
