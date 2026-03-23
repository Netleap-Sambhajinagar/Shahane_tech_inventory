-- Check if columns exist and add them if needed
USE shahane_tech;

-- Check if main_image column exists
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'shahane_tech' 
AND TABLE_NAME = 'products' 
AND COLUMN_NAME = 'main_image';

-- Add main_image column if it doesn't exist
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN main_image TEXT AFTER image_url',
    'SELECT "Column main_image already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Check if thumbnail_images column exists
SET @col_exists = 0;
SELECT COUNT(*) INTO @col_exists 
FROM INFORMATION_SCHEMA.COLUMNS 
WHERE TABLE_SCHEMA = 'shahane_tech' 
AND TABLE_NAME = 'products' 
AND COLUMN_NAME = 'thumbnail_images';

-- Add thumbnail_images column if it doesn't exist
SET @sql = IF(@col_exists = 0, 
    'ALTER TABLE products ADD COLUMN thumbnail_images TEXT AFTER main_image',
    'SELECT "Column thumbnail_images already exists"');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- Migrate existing data if needed
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

SELECT 'Database schema updated successfully!';
