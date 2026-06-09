import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 text-foreground">
      <Card className="w-full max-w-md shadow-soft">
        <CardHeader>
          <CardTitle className="text-2xl">Page not found</CardTitle>
          <CardDescription>This path is not registered yet. Add a route in src/App.tsx.</CardDescription>
        </CardHeader>
        <CardContent>
          <Button asChild className="min-h-11 w-full">
            <Link to="/">Back home</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
