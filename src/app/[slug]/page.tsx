"use client";

import { use, useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';


import { DatabaseZap, Clock, Ellipsis } from "lucide-react"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { DatePickerWithPresets } from "@/components/ui/drop-calendar"

interface ItemData {
  title: string;
  time: string;
  description: string;
  listId: string;
}

interface Task {
  id: string;
  title: string;
  time: string;
  description: string;
  listId?: string
}

interface pageTitleObject {
  [key: string]: string;
}

type DynamicObject = {
  [key: string]: {
    title: string;
    time: string;
    description: string;
    listId?: string;
  };
};

const transformObjectToArray = (obj: DynamicObject): Task[] => {
  return Object.entries(obj).map(([id, { title, time, description, listId }]) => ({
    id,
    title,
    time,
    description,
    listId
  }));
}

const displayDate = (storedDateStr: string) => {


  const date = new Date();
  const storedDate = new Date(storedDateStr)
  const addDay = date.setDate(date.getDate() + 1);


  // 表示形式を決定
  let displayText;
  switch (storedDate.getDate() - date.getDate()) {
    case -1:
      displayText = '今日';
      break;
    case 0:
      displayText = '明日';
      break;
    case 1:
      displayText = '明後日';
      break;
    case 6:
      displayText = '来週';
      break;
    default:
      displayText = `${storedDate.getMonth() + 1}月${storedDate.getDate()}日`;
  }

  return displayText
}


export default function Page({ params }: any) {
  const { slug }: any = use(params);

  const [items, setItems] = useState<Task[]>([])
  const [addList, setAddList] = useState("")
  const [addListDescription, setAddListDescription] = useState("")
  const [addListTime, setAddListTime] = useState("")
  const [pageTitle, setPageTitle] = useState<pageTitleObject>({})

  const handleTimeChange = (newValue: Date) => {
    setAddListTime(`${newValue}`);
  };

  const [checked, setChecked] = useState(false);

  const handleChange = (id: string) => {
    setChecked(!checked);
    if (!checked) {
      deleteList(id)
    }
  };

  const createNewList = () => {
    const data = [...items, { id: uuidv4(), title: addList, time: addListTime, description: addListDescription }]
    setItems(data)

    window.localStorage.setItem(slug,
      JSON.stringify(data.reduce((acc: Record<string, ItemData>, { id, title, time, description, listId = '' }) => {
        acc[id] = { title, time, description, listId };
        return acc;
      }, {}))
    );
  }

  const deleteList = (id: string) => {
    const data = items.filter((item) => item.id !== id);

    setItems(data)

    window.localStorage.setItem(slug,
      JSON.stringify(data.reduce((acc: Record<string, ItemData>, { id, title, time, description, listId = '' }) => {
        acc[id] = { title, time, description, listId };
        return acc;
      }, {}))
    );

    const check = window.localStorage.getItem("checktask")
    if (check) {
      window.localStorage.setItem("checktask",
        JSON.stringify(
          { ...JSON.parse(check), [id]: { ...items.find(item => item.id === id), listId: slug } }
        )
      )
    } else {
      window.localStorage.setItem("checktask",
        JSON.stringify(
          { [id]: { ...items.find(item => item.id === id), listId: slug } }
        )
      )
    }
  }

  const moveTrash = (id: string) => {
    const data = items.filter((item) => item.id !== id);

    setItems(data)

    window.localStorage.setItem(slug,
      JSON.stringify(data.reduce((acc: Record<string, ItemData>, { id, title, time, description, listId = '' }) => {
        acc[id] = { title, time, description, listId };
        return acc;
      }, {}))
    );
  }

  const moveTodo = (id: string, listId: string) => {
    const data = items.filter((item) => item.id !== id);

    console.log(listId)

    setItems(data)

    window.localStorage.setItem(slug,
      JSON.stringify(data.reduce((acc: Record<string, ItemData>, { id, title, time, description, listId = '' }) => {
        acc[id] = { title, time, description, listId };
        return acc;
      }, {}))
    );

    const check = window.localStorage.getItem(listId)
    if (check) {
      window.localStorage.setItem(listId,
        JSON.stringify(
          { ...JSON.parse(check), [id]: { ...items.find(item => item.id === id), listId: slug } }
        )
      )
    } else {
      window.localStorage.setItem(listId,
        JSON.stringify(
          { [id]: { ...items.find(item => item.id === id), listId: slug } }
        )
      )
    }
  }

  useEffect(() => {
    const res = window.localStorage.getItem(slug);
    const pageTitleRom = window.localStorage.getItem("list")

    if (pageTitleRom){
      setPageTitle(JSON.parse(pageTitleRom))
    }else{
      setPageTitle({defaultTask:"旅行のタスク", checktask: "完了済みタスク", mytask: "マイタスク"})
      window.localStorage.setItem("list", JSON.stringify(
        {defaultTask:"旅行のタスク", checktask: "完了済みタスク", mytask: "マイタスク"}
      ))
    }

    if (res) {
      const resJSON: DynamicObject = JSON.parse(res)
      const resultArray: Task[] = transformObjectToArray(resJSON)
      setItems(resultArray)
    }
  }, []);

  return (
    <div className="px-2 sm:px-8">
      <div className="mx-auto text-base md:max-w-3xl lg:max-w-[40rem] xl:max-w-[48rem]">
        <h1 className="font-bold text-2xl mb-3">{pageTitle[slug]}</h1>

        {
          slug != "checktask" ?
            <Card className="p-2 flex mb-4">
              <Dialog>
                <DialogTrigger className="w-full">
                  <Input id="title" className="w-full" placeholder="タイトルを入力" />
                </DialogTrigger>

                <DialogContent className="w-[24rem]">
                  <div className="grid gap-4 py-4">
                    <DialogHeader>
                      <DialogTitle>新しいTodoを作成</DialogTitle>
                      <DialogDescription>
                        このリストタブにTodoを追加
                      </DialogDescription>
                    </DialogHeader>
                    <form>
                      <div className="grid w-full items-center gap-4">
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">title</Label>
                          <Input id="name" placeholder="タイトルを入力" value={addList} onChange={(event) => setAddList(event.target.value)} />
                        </div>
                        <div className="flex flex-col space-y-1.5">
                          <Label htmlFor="name">description</Label>
                          <div className="flex">
                            <Input id="name" placeholder="詳細を追加" className="mr-2" value={addListDescription} onChange={(event) => setAddListDescription(event.target.value)} />
                            <DatePickerWithPresets handleTimeChange={handleTimeChange} />
                          </div>
                        </div>
                      </div>
                    </form>
                  </div>
                  <DialogFooter className="flex justify-between">
                    <DialogClose asChild>
                      <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                      <Button type="button" onClick={createNewList}>
                        追加
                      </Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </Card>
            :
            <></>
        }


        {items.map((item, index) => (
          <Card className="p-3 mt-2 flex" key={item.id}>
            {
              slug == "checktask" ?
                <Checkbox className="mr-2 w-6 h-6 rounded-full" />
                :
                <Checkbox className="mr-2 w-6 h-6 rounded-full" onCheckedChange={() => handleChange(item.id)} />
            }
            <div className="w-full">
              <div className="flex relative w-full">
                <CardTitle className="text-md">{item.title}</CardTitle>

                {
                  slug == "checktask" && item.listId ?
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Ellipsis className="absolute right-2 top-0 translate-x-1/2 opacity-70" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="right" align="start">
                        <DropdownMenuItem>
                          <span onClick={() => moveTodo(item.id, item.listId as string)}>Todoを戻す</span>
                        </DropdownMenuItem>

                        <DropdownMenuItem>
                          <span className="text-red-500" onClick={() => moveTrash(item.id)}>Todoを削除</span>
                        </DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>
                    :
                    <></>
                }

              </div>
              <CardDescription>{item.description}</CardDescription>
              {
                item.time != "undefined" ?
                  <div className="flex text-sm opacity-60 mt-1">
                    <Clock className="w-4" />
                    <p>{displayDate(item.time)}</p>
                  </div>
                  :
                  <></>
              }
            </div>
          </Card>
        ))}


        {
          items.length ?
            <></> :
            <div className="opacity-30">
              <DatabaseZap className="w-28 h-28" />
              <h1 className="text-2xl font-bold mt-5">Todoがまだありません</h1>
              <p>上のタイトルを入力...</p>
            </div>
        }
      </div>
    </div>
  );
}

/*const originalObject: DynamicObject = {
    dd54378543: { title: "歯磨き", time: "543", description: "あんまり出しすぎない" },
    dd55378543: { title: "風呂", time: "243", description: "あんまりない" },
  };*/

//window.localStorage.setItem("c41679b4-d441-4573-a361-ff8fcf6d9ff7", '{"dd54378543": { "title": "歯磨き", "time": "14:20", "description": "あんまり出しすぎない" },"dd55378543": { "title": "風呂", "description": "あんまりない"},"dd55378541": { "title": "風呂なんか入んねーよ"}}')

/*
Reactってねぇ厳密すぎんのよ
ねぇそう思わない？おれっちがやりたいことはシンプル。
ボタンをクリックしたら画面を表示させる
でもね
*/