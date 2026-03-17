const db = require('./models/database');

async function checkOrdersSchema() {
    try {
        console.log('Checking orders table schema...');
        
        const [rows] = await db.query('DESCRIBE orders');
        console.log('Orders table structure:');
        rows.forEach(row => console.log(`- ${row.Field}: ${row.Type}`));
        
        // Check if cancellation columns exist
        const hasCancellationReason = rows.some(row => row.Field === 'cancellation_reason');
        const hasCancellationDescription = rows.some(row => row.Field === 'cancellation_description');
        
        console.log('\nCancellation columns:');
        console.log(`- cancellation_reason: ${hasCancellationReason ? 'EXISTS' : 'MISSING'}`);
        console.log(`- cancellation_description: ${hasCancellationDescription ? 'EXISTS' : 'MISSING'}`);
        
        if (!hasCancellationReason || !hasCancellationDescription) {
            console.log('\nAdding missing cancellation columns...');
            
            if (!hasCancellationReason) {
                await db.query('ALTER TABLE orders ADD COLUMN cancellation_reason VARCHAR(255)');
                console.log('✅ Added cancellation_reason column');
            }
            
            if (!hasCancellationDescription) {
                await db.query('ALTER TABLE orders ADD COLUMN cancellation_description TEXT');
                console.log('✅ Added cancellation_description column');
            }
            
            console.log('\n✅ Database schema updated successfully!');
        } else {
            console.log('\n✅ All cancellation columns exist');
        }
        
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

checkOrdersSchema();
