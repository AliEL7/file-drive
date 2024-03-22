import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import { Doc, Id } from "../../../../convex/_generated/dataModel"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"
import { FileTextIcon, GanttChartIcon, ImageIcon, MoreVertical, StarIcon, TextIcon, TrashIcon } from "lucide-react"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
  } from "@/components/ui/alert-dialog"
import { ReactNode, useState } from "react"
import { useMutation, useQuery } from "convex/react"
import { api } from "../../../../convex/_generated/api"
import { toast, useToast } from "@/components/ui/use-toast"
import { getFileUrl } from "../../../../convex/files"
import { ConvexError } from "convex/values"


function FileCardActions({ file }: { file:Doc<"files"> }){
    const deleteFile = useMutation(api.files.deleteFile);
    const toggleFavorite = useMutation(api.files.toggleFavorite);
    const {toast} = useToast();

    const [isConfirmOpen, setIsConfirmOpen] = useState(false);
    return (
        <>
        <AlertDialog open = {isConfirmOpen} onOpenChange={setIsConfirmOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your account
                            and remove your data from our servers.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={async () => {
                            // Confirm File deletion
                            await deleteFile({
                                fileId: file._id
                                });
                                toast({
                                    variant: "default",
                                    title: "File Deleted",
                                    description: "The file is no longer available in our system",
                                });
                            }}>
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        <DropdownMenu>
                <DropdownMenuTrigger><MoreVertical /></DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem 
                        onClick={() => {
                            toggleFavorite({
                                fileId: file._id
                            })
                        }}
                        className="flex gap-1 items-center cursor-pointer">
                        <StarIcon className="w-4 h-4" />Favorite
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                        onClick={() => setIsConfirmOpen(true)}
                        className="flex gap-1 text-red-600 items-center cursor-pointer">
                        <TrashIcon className="w-4 h-4" />Delete
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu></>
    )
}



  export function FileCard({ file }: { file:Doc<"files">}){

    const typeIcons = {
        "image": <ImageIcon />,
        "pdf": <FileTextIcon />,
        "csv": <GanttChartIcon />,
      }as Record<Doc<"files">["type"], ReactNode>;
      const fileUrl = useQuery(api.files.getFileUrl, { fileId: file.fileId });


    return(
        <Card>
            <CardHeader className="relative">
                <CardTitle className="flex gap-2">
                <div className="flex justify-center">{typeIcons[file.type]}</div>
                    {file.name}
                </CardTitle>
                <div className="absolute top-2 right-2 ">
                    <FileCardActions file= {file} />
                </div>
                {/*<CardDescription>Card Description</CardDescription>*/}
            </CardHeader>
            <CardContent className="h-[200px] flex justify-center items-center" >
            {file.type === "csv" && <GanttChartIcon className="w-20 h-20" />}
            {file.type === "pdf" && <FileTextIcon className="w-20 h-20" />}
            {file.type === "image" && fileUrl && <img 
                alt={file.name}
                width="200"
                height="100"
                src={fileUrl} 
                />
            }
            </CardContent>
            <CardFooter className="flex justify-center">
                <Button onClick={() => {
                    if (fileUrl){
                        // open a new tab to the file location on convex
                        window.open(fileUrl, "_blank");
                    }else {
                        //handle the case when fileUrl is null or undefined
                        toast({
                            variant: "destructive",
                            title: "File URL is not available.",
                            description: "The file is no longer available in our system. Proceed to delete it",
                        });
                    }

                }}>Download</Button>
            </CardFooter>
        </Card>
    )
  }