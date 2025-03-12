# **DWARF**  
A website that builds other websites 🚀  

## **Overview**  
A web-based, AI-driven tool that allows users to generate fully functional, responsive websites through simple inputs, without any coding knowledge. It uses **Gemini AI** to generate website code and **Convex** as the backend database.

## **Features**  
✅ AI-generated websites using **Gemini API**  
✅ Live preview of generated code  
✅ Full file explorer for project management  
✅ Convex-powered backend for seamless data handling  

## **Tech Stack**  
- **Next.js** – React framework for frontend  
- **Convex** – Backend database & state management  
- **Tailwind CSS** – Styling  
- **Sandpack** – Code editor & preview  
- **Docker** – Containerized deployment  

---

## **Setup & Installation**  

### **1. Clone the Repository**  
```sh
git clone https://github.com/saigopalakrishnavinjamuri/dwarf.git
cd dwarf
```

### **2. Install Dependencies**  
```sh
npm install
```

### **3. Set Up Environment Variables**  
Create a `.env.local` file in the root directory and add the following:  
```ini
NEXT_PUBLIC_OAUTH_CLIENT_ID=your-google-oauth-client-id

CONVEX_DEPLOYMENT=dev:ideal-cobra-205 # Update for production if needed
NEXT_PUBLIC_CONVEX_URL=https://ideal-cobra-205.convex.cloud

NEXT_PUBLIC_GEMINI_API_KEY=your-gemini-api-key
```

### **4. Start Convex Development Server**  
```sh
npx convex dev
```

### **5. Run the Next.js App**  
```sh
npm run dev
```
The app should now be running at **`http://localhost:3000`** 🎉  

---

## **Docker Setup**  

### **1. Build the Docker Image**  
```sh
docker build -t dwarf .
```

### **2. Run the Container**  
```sh
docker run -p 3000:3000 --env-file .env.local dwarf
```
Your app will be accessible at **`http://localhost:3000`**.

---

## **Deployment**  
For deploying to **Vercel**, **Docker**, or a **custom server**, make sure to:  
- Set environment variables in the deployment platform  
- Use **Convex production deployment**  
- Ensure proper API key security  

---

## **Contributing**  
Contributions are welcome! If you want to add features or fix bugs:  
1. Fork the repo  
2. Create a new branch  
3. Make your changes  
4. Open a pull request  

---
## **~ Team Drawf**
