import { getStorages } from "./components/queryFunctions";
import { getSession } from "~/utils/getSession";
import ShelfCard from "./components/ShelfCardComp";

const Layout = async () => {
  const session = await getSession();
  const storages = await getStorages(session);

  return <ShelfCard storages={storages} />;
};

export default Layout;
