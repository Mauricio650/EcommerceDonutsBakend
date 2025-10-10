## Backend E-Commerce for Donut shop in barranquilla, colombia

This project was create for a donut business, the main idea is offer its products online.

![Status](https://img.shields.io/badge/finished-green?style=for-the-badge)


## 📚 Table of Contents
- [About](#-about)
- [Features](#-features)
- [Installation and usage](#-installation-and-usage)
- [Tech Stack](#-tech-stack)
- [Contributing](#-contributing)
- [License](#-license)
- [Author](#-author)


## 🧠 About

This backend is part of an e-commerce designed to expand the business's popularity and improve processes such as customer orders, delivery, client management and income tracking.


## 🌟 Features

- API REST
- Modular architecture with model injection
- MVC design pattern
- CRUD for products, clients and users
- Data validation with zod
- User authentication with JWT
- Role-based access control and route protection
- Password encryption with bcrypt
- File management with cloudinary
- Route testing with jest


## ⚙️ Installation and usage

1. Clone the repository:
   ```bash
   git clone https://github.com/Mauricio650/EcommerceDonutsBakend
   
   cd EcommerceDonutsBakend

   pnpm install

   pnpm start
   ```

2. environment variables

    2.1 Create a .env file with this variables

    ```bash
    PORT='port to running server'
    JWT_SECRET_KEY='for auth win jwt'
    CLOUDINARY_NAME='config with your cloudinary account'
    API_KEY_CLOUDINARY='config with your cloudinary account'
    API_SECRET_CLOUDINARY='config with your cloudinary account'
    USER_DB='config with your mysql account'
    PASSWORD_DB='config with your mysql account'
    DATABASE='config with your mysql account'
    USER_TEST='user admin to test routes'
    PASSWORD_TEST='password admin to test routes'
    ``` 

3. Import the database structure
 You can create the same DB structure using the SQL file located in: /EcommerceDonuts/db_structure/file

In MySQL Workbench:
- Go to **Server > Data Import**
- Select **Import from Self-Contained File**
- Choose the file and click **Start Import**

4. Cloud Storage

create an account https://cloudinary.com/users/login and use the variable required


**Important**

>  🧩 Note: The frontend of this project is available in a separate repository
> [EcommerceDonuts Frontend](https://github.com/Mauricio650/EcommerceDonuts)


## 🧰 Tech stack

- **Backend:** Express, Node
- **Database:** Mysql
- **Cloud storage:** Cloudinary with Multer and streamifier
- **Auth:** JWT
- **Hash:** Bycrypt
- **Validations:** [Zod](https://zod.dev/)
- **Test:** Jest


## 🤝 Contributing

Contributions, issues, and features request are welcome!
Feel free to fork this repo and submit and pull request.

> 🧩 Remember: to create a new route, you must:
> 1. Create a new route in `src/routes/`
> 2. Create a controller function in `src/controllers/`
> 3. Create a model function in `src/models/`
> 4. Add a new test for that route in `src/test/endToEnd.test.js`


## 📄 License

This project is licensed under MIT License


## 👤 Author

**Mauricio ibañez bermudez**
**GitHub:** https://github.com/Mauricio650

