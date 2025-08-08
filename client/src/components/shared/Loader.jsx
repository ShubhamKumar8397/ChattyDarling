import { Loader } from 'lucide-react';

export function RotatingLoader({ className = "", classNameLoader= "" }) {
    return (
        <div className={className ? `${className}` : ""}>
            <Loader className={classNameLoader ? `${classNameLoader}` : "animate-spin w-6 h-6 text-white"} />
        </div>
    );
}
