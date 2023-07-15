const template =  {

  coupon : (customerName, message, coupon, expirationDate, code) => {
  const html =  `
  <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Your Mailing Title</title>
          <style>
            /* CSS styles for your mailing */
            body {
              font-family: Arial, sans-serif;
              background-color: #f7f7f7;
            }
            
            .container {
              max-width: 600px;
              margin: 0 auto;
              
              background-color: #ffffff;
              border-radius: 5px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
            
            .thank-box {
              background-color: #c668e4;
              width: 100%;
              height: 125px;
              display: flex;
            }
            
            .thank-box > p {
              color: white;
              text-align:center;
              font-size: 1.2rem;
              margin: auto;
              width: 50%;
              font-weight: 800;
            }
            
            .content-wrapper {
              padding: 20px;
            }
            
            h1 {
              color: #333333;
              text-align: center;
            }
            
            p {
              margin-bottom: 20px;
              line-height: 1.5;
            }
            
            .button {
              display: inline-block;
              padding: 10px 20px;
              background-color: #aa70c2;
              color: #ffffff;
              text-decoration: none;
              border-radius: 5px;
            }
            
            .code-wrapper {
                  width: 300px;
                  height: 80px;
                  /* background-color: red; */
                  margin: auto;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                  border-radius: 10px;
                  border: 3px solid #140c0c;
            }
            
            .code-wrapper > h1 {
            	color: #6e3ea9;
                margin: auto;
            }
            
            .footer {
              margin-top: 30px;
              text-align: center;
              color: #999999;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          
          
          <div class="container">
            <div class="thank-box">
				<p>THANK YOU FOR BEING OUR CUSTOMER ...</p>
            </div>
            
            <div class="content-wrapper">
            	<h1>GET ${coupon}% OFF</h1>
                <p style="text-align: center">Here's your coupon code${expirationDate?`- but hurry!<strong>Ends ${expirationDate}</strong>` : ""} </p>
                
                <div class="code-wrapper">
                  <h1>${code}</h1>
                </div>
                
                
                <p style="text-align: center;
                          width: 80%;
                          margin: auto;
                          padding: 28px 0 10px 0;">${customerName}
                          ${message ? message : ` Please redeem this coupon code on any products before ${expirationDate} to receive instant ${coupon} % off at checkout?`} 
                          </p>
                <p style="text-align: center;">
                  <a class="button" href="https://example.com">Visit Our Website</a>
                </p>
                <p style="text-align: center">If you have any questions, please don't hesitate to contact us at 
                </p>
                <a href="tel:+84 949764207" style="text-align:center; width: 100%; display: block">+84 949764207</a>
                <div class="footer">
                  &copy; 2023 Canh Pham. All rights reserved.
                </div>
            </div>
          </div>
        </body>
        </html>
  `
    return html;
  }

}

module.exports = template