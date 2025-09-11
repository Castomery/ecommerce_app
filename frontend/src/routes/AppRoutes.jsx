import Home from "../pages/Home";
import Orders from "../pages/Orders";
import PlaceOrder from "../pages/PlaceOrder";
import Login from "../pages/Login";
import Cart from "../pages/Cart";
import Product from "../pages/Product";
import Contact from "../pages/Contact";
import About from "../pages/About";
import Collection from "../pages/Collection";

const routes = [
  { path: "/", element: <Home /> },
  { path: "/collection", element: <Collection /> },
  { path: "/about", element: <About /> },
  { path: "/contact", element: <Contact /> },
  { path: "/product/:productId", element: <Product /> },
  { path: "/cart", element: <Cart /> },
  { path: "/login", element: <Login /> },
  { path: "/place-order", element: <PlaceOrder /> },
  { path: "/orders", element: <Orders /> },
];

export default routes;