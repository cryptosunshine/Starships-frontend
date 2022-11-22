import { GlobalProvider } from "../state/provider";

const AppProviders = ({children}:any) =>{
    return <GlobalProvider>{children}</GlobalProvider>
}
export default AppProviders;
