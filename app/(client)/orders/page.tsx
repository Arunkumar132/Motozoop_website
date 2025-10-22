import Container from "@/components/Container";
import OrdersComponent from "@/components/OrdersComponent";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Table, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrders } from "@/sanity/queries";
import { auth } from "@clerk/nextjs/server";
import { FileX } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

import React from "react";

const OrdersPage = async() => {
  const {userId} = await auth();
  if(!userId){
    return(
      redirect('/')
    )
  }
  const orders = await getOrders(userId);
    return(
        <div>
          <Container className="py-10">
            {orders?.length ? <Card className="w-full">
              <CardHeader>
                <CardTitle>My Orders</CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px] md:w-auto">Order Number</TableHead>
                        <TableHead className="hidden md:table-cell">Date</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead className="hidden sm:table-cell">Email</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Order Status</TableHead>
                        <TableHead className="hidden sm:table-cell">Invoice Number</TableHead>
                        <TableHead>Tracking ID</TableHead>
                        <TableHead>Partner</TableHead>
                      </TableRow>
                    </TableHeader>
                    <OrdersComponent orders={orders} />
                  </Table>
                  <ScrollBar orientation="horizontal"/>
                </ScrollArea>
              </CardContent>
            </Card> : 
            <div className="flex flex-col items-center justify-center h-[70vh]">
                <FileX className="h-24 w-24 text-gray-400 mb-4" />
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Orders Found</h2>
                <p className="text-gray-600">You have not placed any orders yet.</p>
                <Button asChild className="mt-4 bg-shop_dark_green hover:bg-shop_btn_dark_green/80 text-white">
                  <Link href="/shop">Browse Products</Link>
                </Button>
              </div>}
          </Container>
        </div>
    )
}


export default OrdersPage;

