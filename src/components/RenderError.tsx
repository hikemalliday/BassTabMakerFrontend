import { AxiosError } from "axios";

export const RenderError = ({ errorObject }: { errorObject: AxiosError }) => {
  if (Object.keys(errorObject).length === 0) return null;
  return (
    <div className="render-error-container">
      {Object.entries(errorObject?.response?.data as object).map(
        ([key, val], i) => {
          return (
            <div key={i} className="error-detail">
              {key}: {val}
            </div>
          );
        }
      )}
    </div>
  );
};
