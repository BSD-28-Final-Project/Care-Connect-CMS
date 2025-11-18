import { createBrowserRouter } from "react-router-dom";
import Home from "../screens/Home";
import Login from "../screens/Login";
import CreateActivity from "../screens/CreateActivity";
import ActivityDetail from "../screens/ActivityDetail";

const router = createBrowserRouter([
    {
        path: "/",
        element: <Home />,
    },
    {
        path: "/login",
        element: <Login />,
    },
    {
        path: "/create-activity",
        element: <CreateActivity />,
    },
    {
        path: "/activity/:id",
        element: <ActivityDetail />,
    },
]);

export default router;
