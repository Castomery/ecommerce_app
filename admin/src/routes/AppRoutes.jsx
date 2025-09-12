import AddPage from "../pages/AddPage";
import ListPage from "../pages/ListPage";
import OrdersPage from "../pages/OrdersPage";

const routes = [
  { path: "/add", element: <AddPage /> },
  { path: "/list", element: <ListPage /> },
  { path: "/orders", element: <OrdersPage /> },
];

export default routes;