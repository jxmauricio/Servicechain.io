const { useAppContext } = require("@/context/AppContext");

const {userData,setUserData} = useAppContext();

<Button onClick={setUserData}></Button>