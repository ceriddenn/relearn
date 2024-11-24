import Toast, {
  BaseToast,
  ErrorToast,
  ToastType,
} from "react-native-toast-message";

const toastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#ff8fab", backgroundColor: "#111827" }}
      contentContainerStyle={{ paddingHorizontal: 15, flexGrow: 1, flex: 1 }}
      text1Style={{
        fontSize: 18,
        fontWeight: "400",
        color: "white",
      }}
      text2Style={{
        fontSize: 15,
        fontWeight: "300",
        color: "#9ca3af",
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: (props) => (
    <ErrorToast
      {...props}
      style={{
        borderLeftColor: "#ef4444",
        backgroundColor: "#111827",
        flexDirection: "row",
        alignItems: "center",
        height: "auto",
      }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        flex: 1,
        flexDirection: "column",
        paddingVertical: 8,
      }}
      text1Style={{
        fontSize: 18,
        fontWeight: "400",
        color: "white",
        flex: 0, // Ensures it doesn't shrink to fit
        flexWrap: "wrap",
        width: "100%",
        textAlign: "left",
      }}
      text2Style={{
        fontSize: 15,
        fontWeight: "300",
        color: "#9ca3af",
        flex: 0, // Ensures it doesn't shrink to fit
        flexWrap: "wrap",
        width: "100%",
        textAlign: "left",
      }}
      text1Props={{
        numberOfLines: 0, // Allows unlimited lines
      }}
      text2Props={{
        numberOfLines: 0, // Allows unlimited lines
      }}
    />
  ),
};

const showToast = (title: string, desc: string, type?: ToastType) => {
  Toast.show({
    type: !type ? "success" : type,
    text1: title,
    text2: desc,
  });
};

export { toastConfig, showToast };
