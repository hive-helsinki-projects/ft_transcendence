import { useTranslation } from "react-i18next";

const useTranslate = () => {
    const { t } = useTranslation();
    return t;
};

export default useTranslate;