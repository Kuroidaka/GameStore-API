const DB = require('../config/database');
const service = require('../service')

const discount = { 
    generate: async (req, res) => { 

        let connection = await DB.getConnection();
        
        try{            
            const { amount, expiration} = req.body;

    
            await connection.beginTransaction();

            const discount_code = await service.generateDiscountCode(8)

            if(discount_code) {

                const expirationDate = new Date();
                expirationDate.setDate(expirationDate.getDate() + 30);

                await connection.query(` 
                INSERT INTO Discounts (discount_code, discount_amount, expiration_date)
                VALUES ('${discount_code}', '${amount}', '${expirationDate.toISOString().slice(0, 19).replace('T', ' ')}')
                `)
                // Commit the transaction
                await connection.commit();
    
                return res.status(200).json({ msg: 'discount created successfully' });
            }
            return res.status(404).json({ msg: 'Generate discount fail' });
       
        } catch (err) {
            console.error(err);

                // Rollback the transaction if an error occurs
            if (connection) {
                await connection.rollback();
            }
            return res.status(500).json({ msg: 'Server Error' });
        }finally {
            // Release the connection back to the pool
            if (connection) {
                connection.release();
            }
            }

    },
    apply: async (req, res) => {
        
    }
}

module.exports = discount

