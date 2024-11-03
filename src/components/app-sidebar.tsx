"use client";

import Link from "next/link"
import { useState, useEffect } from "react";

import { v4 as uuidv4 } from 'uuid';

import { Calendar, Home, Inbox, Search, Settings, Plus, BookCheck, Book, ChevronUp, History, MoreHorizontal } from "lucide-react"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import {
  Sidebar,
  SidebarFooter,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroupAction,
  SidebarMenuAction
} from "@/components/ui/sidebar"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogClose,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const defaultItem = [
  {
    title: "マイタスク",
    url: "mytask",
    icon: Book,
    id: uuidv4()
  },
  {
    title: "完了済みタスク",
    url: "checktask",
    icon: BookCheck,
    id: uuidv4()
  }
]

const option = [
  {
    title: "履歴",
    url: "history",
    icon: History,
    id: uuidv4()
  },
  {
    title: "設定",
    url: "settings",
    icon: Settings,
    id: uuidv4()
  },
]

export function AppSidebar() {

  const [items, setItems] = useState([{
    title: "旅行のタスク",
    id: "defaultTask",
  }])

  useEffect(() => {
    const res = window.localStorage.getItem("list");
    if (res) {
      setItems(
        Object.entries(JSON.parse(res))
          .map(([id, title]) => ({
            title: title as string, // titleをstring型としてアサート
            id,
          }))
      );
    }
  }, []);

  interface EditView {
    [key: string]: any; // 任意の文字列をキーとして任意の型の値を持つ
  }

  const [addList, setAddList] = useState("")
  const [editTitle, setEditTitle] = useState("")
  const [editView, setEditView] = useState<EditView>({})

  function createList() {
    const uuid = uuidv4()
    const newItem = [
      ...items,
      {
        title: addList,
        id: uuid,
      }
    ]

    window.localStorage.setItem("list", JSON.stringify(
      newItem.reduce((acc, { id, title }) => {
        acc[id] = title;
        return acc;
      }, {} as Record<string, string>)
    ))

    window.localStorage.setItem("list", JSON.stringify(
      newItem.reduce((acc, { id, title }) => {
        acc[id] = title;
        return acc;
      }, {} as Record<string, string>)
    ))

    window.localStorage.setItem(uuid, JSON.stringify({}))
    setItems(newItem)
  }

  function editList(id: string, index: string) {
    const newItems = items.map(task => {
      if (task.id === id) {
        return { ...task, title: editTitle };
      }
      return task;
    })

    setItems(newItems);

    // localStorage の更新
    window.localStorage.setItem("list", JSON.stringify(
      newItems.reduce((acc, { id, title }) => {
        acc[id] = title;
        return acc;
      }, {} as Record<string, string>)
    ));

    setEditView({ [index]: false })

    console.log("実行されました")
  }

  function deleteList(id: string) {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);

    // localStorage の更新
    window.localStorage.setItem("list", JSON.stringify(
      newItems.reduce((acc, { id, title }) => {
        acc[id] = title;
        return acc;
      }, {} as Record<string, string>)
    ));
    console.log("実行されました")
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>, id: string, index: string) => {
    if (event.keyCode === 13) {
      // Enterキーが押された場合
      editList(id, index);
      setEditTitle(''); // 入力値をクリア
    }
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Todo</SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {defaultItem.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>

          <SidebarGroupLabel>List</SidebarGroupLabel>
          <Dialog>
            <DialogTrigger asChild>
              <SidebarGroupAction title="新しいリストを作成">
                <Plus /> <span className="sr-only">新しいリストを作成</span>
              </SidebarGroupAction>
            </DialogTrigger>

            <DialogContent>
              <div className="grid gap-4 py-4">
                <DialogHeader>
                  <DialogTitle>新しいリストを作成</DialogTitle>
                  <DialogDescription>
                    Listタブに新しいToDoListを追加します。
                  </DialogDescription>
                </DialogHeader>

                {addList}

                <div className="grid grid-cols-4 items-center gap-4 mt-5">
                  <Input id="title" className="col-span-3" placeholder="タイトルを入力" value={addList} onChange={(event) => setAddList(event.target.value)} />
                  <DialogClose asChild>
                    <Button type="button" variant="secondary" onClick={() => createList()}>
                      追加
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </DialogContent>

          </Dialog>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => {
                if (item.id !== "checktask" && item.id !== "mytask") {
                  return (
                    <SidebarMenuItem key={item.id}>
                      <SidebarMenuButton asChild>
                        {
                          editView[index + item.id] ?
                            <Input id="title" className="col-span-3" placeholder="タイトルを編集..." value={editTitle} onChange={(event) => setEditTitle(event.target.value)} onKeyDown={(e) => handleKeyDown(e, item.id, index + item.id)} />
                            :
                            <Link href={item.id}>
                              <span>{item.title}</span>
                            </Link>
                        }
                      </SidebarMenuButton>

                      {
                        editView[index + item.id] ?
                          <></> :
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <SidebarMenuAction>
                                <MoreHorizontal />
                              </SidebarMenuAction>

                            </DropdownMenuTrigger>
                            <DropdownMenuContent side="right" align="start">
                              <DropdownMenuItem>
                                <span onClick={() => { setEditView({ [index + item.id]: true }); setEditTitle(item.title) }}>リストを編集</span>
                              </DropdownMenuItem>

                              <DropdownMenuItem>
                                <DropdownMenu>
                                  <DropdownMenuTrigger><span className="text-red-500">リストを削除</span></DropdownMenuTrigger>
                                  <DropdownMenuContent>
                                    <DropdownMenuLabel>削除しますか?</DropdownMenuLabel>
                                    <DropdownMenuItem>
                                      <Link href="mytask" onClick={() => deleteList(item.id)}>
                                        <span className="text-red-500">リストを削除</span>
                                      </Link>
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </DropdownMenuItem>

                            </DropdownMenuContent>
                          </DropdownMenu>
                      }
                    </SidebarMenuItem>
                  )
                }
                return null
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarGroup>
          <SidebarGroupLabel>設定</SidebarGroupLabel>
          <SidebarGroupContent className="mb-12">
            <SidebarMenu>
              {option.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarFooter>
    </Sidebar>

  )
}
