import { Skeleton } from "../ui/skeleton";


export default function UserPageSkeleton() {
    return (
        <div className="space-y-6">
            <div>
                <div className="flex flex-row items-center justify-between py-4">
                    <div className="flex flex-row items-center space-x-4">
                        <Skeleton className="w-20 h-20 rounded-full" />
                        <div className="flex flex-col space-y-2">
                            <Skeleton className="h-6 w-[100px]" />
                            <Skeleton className="h-8 w-[100px]" />
                        </div>
                    </div>
                    <div className="flex flex-row space-x-4">
                        <div className="flex flex-col items-center space-y-2">
                            <Skeleton className="h-6 w-14" />
                            <Skeleton className="h-6 w-14" />
                        </div>
                        <div className="border-l" />
                        <div className="flex flex-col items-center space-y-2">
                            <Skeleton className="h-6 w-14" />
                            <Skeleton className="h-6 w-14" />
                        </div>
                        <div className="border-l" />
                        <div className="flex flex-col items-center space-y-2">
                            <Skeleton className="h-6 w-14" />
                            <Skeleton className="h-6 w-14" />
                        </div>
                        <div className="border-l" />
                        <div className="flex flex-col items-center space-y-2">
                            <Skeleton className="h-6 w-14" />
                            <Skeleton className="h-6 w-14" />
                        </div>
                    </div>
                </div>
                <hr />
            </div>

            <div className="flex flex-row space-x-4 items-center">
                <Skeleton className="h-28 w-[500px]" />
                <div className="flex flex-col max-w-[380px] self-start mt-2 space-y-1">
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-5 w-[300px]" />
                    <Skeleton className="h-5 w-[200px]" />
                </div>
            </div>

            <div className="flex flex-row space-x-4 items-center">
                <Skeleton className="h-28 w-[500px]" />
                <div className="flex flex-col max-w-[380px] self-start mt-2 space-y-1">
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-5 w-[300px]" />
                    <Skeleton className="h-5 w-[200px]" />
                </div>
            </div>

            <div className="flex flex-row space-x-4 items-center">
                <Skeleton className="h-28 w-[500px]" />
                <div className="flex flex-col max-w-[380px] self-start mt-2 space-y-1">
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-5 w-[300px]" />
                    <Skeleton className="h-5 w-[200px]" />
                </div>
            </div>

            <div className="flex flex-row space-x-4 items-center">
                <Skeleton className="h-28 w-[500px]" />
                <div className="flex flex-col max-w-[380px] self-start mt-2 space-y-1">
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-5 w-[300px]" />
                    <Skeleton className="h-5 w-[200px]" />
                </div>
            </div>

            <div className="flex flex-row space-x-4 items-center">
                <Skeleton className="h-28 w-[500px]" />
                <div className="flex flex-col max-w-[380px] self-start mt-2 space-y-1">
                    <Skeleton className="h-6 w-[100px]" />
                    <Skeleton className="h-5 w-[300px]" />
                    <Skeleton className="h-5 w-[200px]" />
                </div>
            </div>
        </div>
    );
}
