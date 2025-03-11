import { UserDetailsContext } from "@/context/UserDetailsContext";
import { api } from "@/convex/_generated/api";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useMutation } from "convex/react";
import { X, LogIn } from "lucide-react";
import { useContext, useEffect } from "react";
import uuid4 from "uuid4";

const SigninDialog = ({ openDialog, closeDialog }) => {

    const CreateUser = useMutation(api.users.CreateUser);
    const { userDetails, setUserDetails } = useContext(UserDetailsContext);

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            console.log(tokenResponse);
            const userInfo = await axios.get(
                'https://www.googleapis.com/oauth2/v3/userinfo',
                { headers: { Authorization: 'Bearer ' + tokenResponse?.access_token } },
            );
        
            console.log(userInfo);
            const user = userInfo.data;

            // ✅ Create user in database & get `_id`
            const userId = await CreateUser({
                name: user.name,
                email: user.email,
                picture: user.picture,
                uid: uuid4(),
            });

            console.log('Created user: ' + userId);

            // ✅ Store full user data including `_id`
            const storedUser = {
                _id: userId,
                name: user.name,
                email: user.email,
                picture: user.picture,
                uid: user.uid,
            };

            if (typeof window !== "undefined") {
                localStorage.setItem("user", JSON.stringify(storedUser));
            }

            setUserDetails(storedUser);
            closeDialog(false);
        },
        onError: errorResponse => console.log(errorResponse),
    });

    useEffect(() => {
        if (openDialog) {
        console.log("Dialog opened");
        }
    }, [openDialog]);

    if (!openDialog) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
        <div className="bg-black text-white w-full max-w-md p-6 rounded-lg shadow-lg relative">
            
            {/* Close Button */}
            <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-200"
            onClick={closeDialog}
            >
            <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <h2 className="text-2xl font-bold text-center">Welcome to DRAWF</h2>
            <p className="text-gray-300 text-center mt-2">
            Sign in to continue using your Google account.
            </p>

            {/* Google Sign-In Button */}
            <button onClick={googleLogin} className="flex items-center justify-center w-full mt-6 bg-purple-700 text-white py-2 px-4 rounded-md hover:bg-purple-800 transition">
            <LogIn className="w-5 h-5 mr-2" />
            Sign in with Google
            </button>

            {/* Cancel Button */}
            <button
            className="mt-4 text-gray-400 hover:text-gray-200 text-sm w-full text-center"
            onClick={closeDialog}
            >
            Cancel
            </button>
        </div>
        </div>
    );
};

export default SigninDialog;
