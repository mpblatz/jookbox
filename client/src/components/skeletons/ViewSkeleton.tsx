import { Skeleton } from "../ui/skeleton";


export default function ViewSkeleton() {
    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col space-y-2">
                <Skeleton className="h-8 w-[300px] " />
                <Skeleton className="h-6 w-[100px] " />
                <Skeleton className="h-8 w-full" />
                <hr />
            </div>
            <div className="flex flex-col space-y-2">
                <div className="flex flex-row space-x-4 items-center">
                    <Skeleton className="w-12 h-12" />
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-5 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>

                <div className="flex flex-row space-x-4 items-center">
                    <Skeleton className="w-12 h-12" />
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-5 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>

                <div className="flex flex-row space-x-4 items-center">
                    <Skeleton className="w-12 h-12" />
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-5 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>

                <div className="flex flex-row space-x-4 items-center">
                    <Skeleton className="w-12 h-12" />
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-5 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>

                <div className="flex flex-row space-x-4 items-center">
                    <Skeleton className="w-12 h-12" />
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-5 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>

                <div className="flex flex-row space-x-4 items-center">
                    <Skeleton className="w-12 h-12" />
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-5 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>

                <div className="flex flex-row space-x-4 items-center">
                    <Skeleton className="w-12 h-12" />
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-5 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>

                <div className="flex flex-row space-x-4 items-center">
                    <Skeleton className="w-12 h-12" />
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-5 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>

                <div className="flex flex-row space-x-4 items-center">
                    <Skeleton className="w-12 h-12" />
                    <div className="flex flex-col space-y-2">
                        <Skeleton className="h-5 w-[200px]" />
                        <Skeleton className="h-4 w-[150px]" />
                    </div>
                </div>
            </div>
        </div>
    );
}
