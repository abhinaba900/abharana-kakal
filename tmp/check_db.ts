import { supabaseAdmin } from './lib/supabase-admin';

async function checkColumns() {
    try {
        const { data, error } = await supabaseAdmin
            .from('yoga_bookings')
            .select('*')
            .limit(1);
        
        if (error) {
            console.error('Fetch error:', error);
            return;
        }
        
        if (data.length > 0) {
            console.log('Columns in yoga_bookings:', Object.keys(data[0]));
        } else {
            console.log('No data in yoga_bookings to check columns.');
        }
    } catch (err) {
        console.error('Check error:', err);
    }
}

checkColumns();
