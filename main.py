#!/usr/bin/python

from PIL import ImageDraw
from PIL import ImageFilter
import requests
import sys
from PIL import Image
from io import BytesIO
import os
token = os.environ['IMMICH_TOKEN']
img_id = "2ba8ba50-6ff2-4f48-8be5-0b2da2481efd"
headers = {'x-api-key':token}

data = {}

metadata = requests.get(f'http://nas.ecurie:2283/api/assets/{img_id}/', headers=headers).json()
for person in metadata['people']:
    name = person['name']
    if len(person['faces']) == 0:
      continue

    face = person['faces'][0]
    box_x1 = face['boundingBoxX1']
    box_x2 = face['boundingBoxX2']
    box_y1 = face['boundingBoxY1']
    box_y2 = face['boundingBoxY2']
    data[name] = [box_x1, box_x2, box_y1, box_y2]

print(data)
img = requests.get(f'http://nas.ecurie:2283/api/assets/{img_id}/original', headers=headers, stream=True)
if img.status_code != 200:
    print('Fuck')
    sys.exit(-1)

img = Image.open(BytesIO(img.content))

# Source - https://stackoverflow.com/q/56987112
# Posted by Otor
# Retrieved 2025-12-15, License - CC BY-SA 4.0

# Create rectangle mask
mask = Image.new('L', img.size, 0)
draw = ImageDraw.Draw(mask)

for person in data:
  face = data[person]
  draw.rectangle([ (face[0],face[2]), (face[1]+50,face[3]+50) ], fill=255)

# Blur image
blurred = img.filter(ImageFilter.GaussianBlur(52))

# Paste blurred region and save result
img.paste(blurred, mask=mask)
img.save("blurredImg.png")
