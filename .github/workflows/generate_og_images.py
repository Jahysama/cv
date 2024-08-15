import os
import glob
from PIL import Image, ImageDraw, ImageFont
import textwrap
import cairosvg
from io import BytesIO


def generate_og_image(title, description, output_path):
    width, height = 1200, 630
    background_color = "#1e1e2e"  # Catppuccin Mocha Base
    title_color = "#cdd6f4"  # Catppuccin Mocha Text
    description_color = "#a6adc8"  # Catppuccin Mocha Subtext0

    image = Image.new("RGB", (width, height), color=background_color)
    draw = ImageDraw.Draw(image)

    # Load fonts (assuming fonts are in the .github/workflows directory)
    title_font = ImageFont.truetype("assets/opengraph/fonts/UbuntuMono-Bold.ttf", 60)
    description_font = ImageFont.truetype(
        "assets/opengraph/fonts/UbuntuMono-Regular.ttf", 30
    )

    # Load and paste the SVG icon
    svg_path = "assets/index/favicon.svg"
    icon_size = 100  # Adjust this value to change the size of the icon
    png_data = cairosvg.svg2png(
        url=svg_path, output_width=icon_size, output_height=icon_size
    )
    icon = Image.open(BytesIO(png_data))
    image.paste(icon, (20, 20), icon)  # 20,20 is the position. Adjust as needed.

    # Draw title
    title_wrapped = textwrap.wrap(title, width=30)
    y_text = 50
    for line in title_wrapped:
        bbox = title_font.getbbox(line)
        line_width = bbox[2] - bbox[0]
        line_height = bbox[3] - bbox[1]
        draw.text(
            ((width - line_width) / 2, y_text), line, font=title_font, fill=title_color
        )
        y_text += line_height

    # Draw description
    description_wrapped = textwrap.wrap(description, width=60)
    y_text = 300
    for line in description_wrapped[:4]:  # Limit to 4 lines
        bbox = description_font.getbbox(line)
        line_width = bbox[2] - bbox[0]
        line_height = bbox[3] - bbox[1]
        draw.text(
            ((width - line_width) / 2, y_text),
            line,
            font=description_font,
            fill=description_color,
        )
        y_text += line_height

    # Ensure the directory exists
    os.makedirs(os.path.dirname(output_path), exist_ok=True)

    # Save the image
    image.save(output_path)


def main():
    # Generate images for all blog posts
    blog_posts = glob.glob("blog_posts/*.md")
    for post in blog_posts:
        with open(post, "r") as f:
            content = f.read()
            # Extract title and description (you may need to adjust this based on your markdown structure)
            title = content.split("\n")[0].replace("# ", "")
            description = content.split("\n")[
                2
            ]  # Assuming the description is the third line
            slug = os.path.basename(post).replace(".md", "")
            generate_og_image(title, description, f"static/og_images/{slug}.png")

    print(
        f"Generated {len(blog_posts)} OG images in Catppuccin Mocha style with favicon."
    )


if __name__ == "__main__":
    main()
