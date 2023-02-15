const { useAppContext } = require("@/context/AppContext");

export default ()=>{
    const {userData} = useAppContext();
    return userData.role;
}