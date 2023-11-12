const DB = require('../config/database');
const service = require('../service')
const { v4: uuidv4 } = require('uuid');

const discount = { 
    generate: async (req, res) => { 

      let connection = await DB.getConnection();
                  
      const { amount, expiration} = req.body;

      const {discountCode} = await service.generateDiscountCode(8, connection, amount, expiration)

      return res.status(200).json({ code: discountCode, msg: 'discount created successfully' });
    },
    applyDiscountCode: async (req, res) => {
        let connection = await DB.getConnection();
      
        try {
          const { discountCode, price } = req.body;
      
          await connection.beginTransaction();
      
          const discount = await service.getDiscountByCode(discountCode);
      
          if (discount) {
            const currentDate = new Date();
      
            if (currentDate <= discount.expiration_date) {
              
              console.log("discount", discount.discount_amount)
              
              const discountedPrice = price - (price * discount.discount_amount);

              await connection.query(`
                DELETE FROM Discounts
                WHERE discount_code = '${discountCode}'
              `);
      
              // Commit the transaction
              await connection.commit();
      
              return res.status(200).json({ discountedPrice: discountedPrice });
            }
      
            return res.status(400).json({ msg: 'Discount code has expired ' });
          }
      
          return res.status(404).json({ msg: 'Discount code not found' });
        } catch (err) {
          console.error(err);
      
          // Rollback the transaction if an error occurs
          if (connection) {
            await connection.rollback();
          }
      
          return res.status(500).json({ msg: 'Server Error' });
        } finally {
          // Release the connection back to the pool
          if (connection) {
            connection.release();
          }
        }
    },
    getListDiscount: async (req, res) => { 

      const [result] = await DB.query(`
      SELECT * FROM Discounts;
      `);

      return res.status(200).json(result);
    },
}

module.exports = discount

