import { Card, CardHeader, CardTitle, CardContent, CardDescription } from './ui/card';
import { Skeleton } from './ui/skeleton';

export default function PostCardSkeleton() {
  return (
    <Card className="relative overflow-hidden transition-colors duration-200 cursor-pointer">
      <div className="absolute inset-0 z-0 bg-cover bg-center opacity-30">
        <Skeleton className="w-full h-full" />
      </div>
      <div className="relative z-10">
        <CardHeader>
          <CardTitle className="text-gray-900">
            <Skeleton className="h-6 w-3/4 mb-2" />
          </CardTitle>
          <CardDescription className="truncate text-gray-700">
            <Skeleton className="h-4 w-full mb-1" />
            <Skeleton className="h-4 w-5/6" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-gray-600 mb-2 flex gap-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="inline-block px-2 py-1 rounded text-xs font-medium mb-2 bg-blue-100">
            <Skeleton className="h-4 w-16 bg-blue-200" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
} 