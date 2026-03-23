const db = require('./models/database');
const fs = require('fs');
const path = require('path');

async function testImageDeletion() {
  try {
    console.log('Testing image deletion functionality...\n');
    
    // Get a product with images
    const [products] = await db.query('SELECT id, product_id, name, images FROM products WHERE images IS NOT NULL AND images != "" LIMIT 1');
    
    if (products.length === 0) {
      console.log('❌ No products with images found');
      return;
    }
    
    const product = products[0];
    console.log('📦 Testing with product:');
    console.log('   ID:', product.id);
    console.log('   Product ID:', product.product_id);
    console.log('   Name:', product.name);
    console.log('   Images:', product.images);
    console.log('   Images type:', typeof product.images);
    console.log();
    
    // Parse image paths
    let imagePaths;
    try {
      imagePaths = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
      console.log('✅ Successfully parsed image paths:', imagePaths);
    } catch (err) {
      console.error('❌ Error parsing images JSON:', err);
      return;
    }
    
    console.log('\n🔍 Checking file existence before deletion:');
    
    // Check each image file
    let filesExist = 0;
    for (const imagePath of imagePaths) {
      if (imagePath && imagePath.trim()) {
        let cleanPath = imagePath;
        if (imagePath.startsWith('/uploads/')) {
          cleanPath = imagePath.substring(8);
        } else if (imagePath.startsWith('uploads/')) {
          cleanPath = imagePath.substring(7);
        }
        
        if (cleanPath.startsWith('/')) {
          cleanPath = cleanPath.substring(1);
        }
        
        const filePath = path.join(__dirname, 'public', 'uploads', cleanPath);
        const exists = fs.existsSync(filePath);
        
        console.log(`   ${imagePath} -> ${filePath}`);
        console.log(`   File exists: ${exists ? '✅ YES' : '❌ NO'}`);
        
        if (exists) {
          filesExist++;
        }
      }
    }
    
    console.log(`\n📊 Summary: ${filesExist}/${imagePaths.length} files found`);
    
    if (filesExist > 0) {
      console.log('\n🧪 Simulating file deletion (files will NOT be actually deleted):');
      
      for (const imagePath of imagePaths) {
        if (imagePath && imagePath.trim()) {
          let cleanPath = imagePath;
          if (imagePath.startsWith('/uploads/')) {
            cleanPath = imagePath.substring(8);
          } else if (imagePath.startsWith('uploads/')) {
            cleanPath = imagePath.substring(7);
          }
          
          if (cleanPath.startsWith('/')) {
            cleanPath = cleanPath.substring(1);
          }
          
          const filePath = path.join(__dirname, 'public', 'uploads', cleanPath);
          
          if (fs.existsSync(filePath)) {
            console.log(`   ✅ Would delete: ${filePath}`);
            // In actual delete function: fs.unlinkSync(filePath);
          } else {
            console.log(`   ⚠️  File not found: ${filePath}`);
          }
        }
      }
    }
    
    console.log('\n✅ Test completed successfully!');
    
  } catch (err) {
    console.error('❌ Test error:', err);
  } finally {
    process.exit(0);
  }
}

testImageDeletion();
