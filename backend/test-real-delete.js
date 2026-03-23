const db = require('./models/database');
const fs = require('fs');
const path = require('path');

async function testRealDeletion() {
  try {
    console.log('🧪 Testing REAL product deletion with image cleanup...\n');
    
    // Get a product with images to delete
    const [products] = await db.query('SELECT id, product_id, name, images FROM products WHERE images IS NOT NULL AND images != "" LIMIT 1');
    
    if (products.length === 0) {
      console.log('❌ No products with images found');
      return;
    }
    
    const product = products[0];
    console.log('📦 About to delete product:');
    console.log('   ID:', product.id);
    console.log('   Product ID:', product.product_id);
    console.log('   Name:', product.name);
    console.log('   Images:', product.images);
    console.log();
    
    // Parse image paths to check before deletion
    let imagePaths;
    try {
      imagePaths = typeof product.images === 'string' ? JSON.parse(product.images) : product.images;
    } catch (err) {
      console.error('❌ Error parsing images JSON:', err);
      return;
    }
    
    console.log('🔍 Checking files before deletion:');
    let filesBefore = [];
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
        filesBefore.push({ path: filePath, exists });
        console.log(`   ${exists ? '✅' : '❌'} ${filePath}`);
      }
    }
    
    console.log('\n🗑️  Executing delete operation...');
    
    // Execute the actual delete logic from productController
    const [result] = await db.query('DELETE FROM products WHERE id = ?', [product.id]);
    
    if (result.affectedRows === 0) {
      console.log('❌ Product not found');
      return;
    }
    
    console.log('✅ Product deleted from database');
    
    // Now delete the image files (same logic as in controller)
    console.log('\n🗑️  Deleting image files...');
    let deletedCount = 0;
    
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
        
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`   ✅ Deleted: ${filePath}`);
            deletedCount++;
          } else {
            console.log(`   ⚠️  File not found: ${filePath}`);
          }
        } catch (fileErr) {
          console.error(`   ❌ Error deleting ${filePath}:`, fileErr.message);
        }
      }
    }
    
    console.log(`\n📊 Results:`);
    console.log(`   Product deleted: ✅`);
    console.log(`   Image files deleted: ${deletedCount}/${imagePaths.length}`);
    
    // Verify files are gone
    console.log('\n🔍 Verifying files are deleted:');
    for (const file of filesBefore) {
      const stillExists = fs.existsSync(file.path);
      console.log(`   ${stillExists ? '❌ STILL EXISTS' : '✅ GONE'} ${file.path}`);
    }
    
    console.log('\n✅ Real deletion test completed!');
    
  } catch (err) {
    console.error('❌ Test error:', err);
  } finally {
    process.exit(0);
  }
}

testRealDeletion();
