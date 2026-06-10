import { Spinner, Card, CardContent } from "@/components/ui/heroui";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4 bg-teams-gray/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-teams-ocean/5 rounded-full blur-[120px] -z-10 pointer-events-none" />
      
      <Card  className="bg-transparent border-none">
        <CardContent className="flex flex-col items-center justify-center gap-6 p-8">
          <Spinner 
            size="lg" 
            variant="primary" 
            label="Loading..." 
            classNames={{
              circle1: "border-b-teams-ocean",
              circle2: "border-b-teams-ocean",
              label: "text-teams-dark font-bold mt-4"
            }} 
          />
          <p className="text-sm font-medium text-foreground-500 max-w-xs text-center animate-pulse">
            Retrieving data and preparing the interface for you.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
