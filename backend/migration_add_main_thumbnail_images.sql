-- Migration script to add main_image and thumbnail_images fields to products table
USE shahane_tech;

-- Add new columns to products table
ALTER TABLE products 
ADD COLUMN main_image TEXT AFTER image_url,
ADD COLUMN thumbnail_images TEXT AFTER main_image;

-- Update existing products to migrate data
-- For products with existing images array, move first image to main_image and rest to thumbnail_images
UPDATE products 
SET 
    main_image = JSON_UNQUOTE(JSON_EXTRACT(images, '$[0]')),
    thumbnail_images = JSON_ARRAY(
        JSON_UNQUOTE(JSON_EXTRACT(images, '$[1]')),
        JSON_UNQUOTE(JSON_EXTRACT(images, '$[2]')),
        JSON_UNQUOTE(JSON_EXTRACT(images, '$[3]')),
        JSON_UNQUOTE(JSON_EXTRACT(images, '$[4]'))
    )
WHERE images IS NOT NULL 
AND JSON_LENGTH(images) > 0
AND main_image IS NULL;

-- Clean up thumbnail_images by removing NULL values
UPDATE products 
SET thumbnail_images = JSON_REMOVE(
    thumbnail_images, 
    '$[0]', '$[1]', '$[2]', '$[3]'
)
WHERE thumbnail_images LIKE '%null%';

-- For products with single image_url but no images array
UPDATE products 
SET main_image = image_url 
WHERE image_url IS NOT NULL 
AND images IS NULL 
AND main_image IS NULL;
