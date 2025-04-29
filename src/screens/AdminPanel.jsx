// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
import { useState } from "react";
import { motion } from "framer-motion";

import { Card, CardContent } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";


export default function AdminPanel() {
  const [meetings, setMeetings] = useState([]);
  const [users, setUsers] = useState([]);
  const [devices, setDevices] = useState([]);

  return (
    <div className="p-6 grid gap-6 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold text-center mb-8">Admin Panel</h1>
      <Tabs defaultValue="meetings" className="w-full">
        <TabsList className="grid grid-cols-4 bg-white p-2 rounded-xl shadow-md">
          <TabsTrigger value="meetings">Meetings</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="devices">IoT Devices</TabsTrigger>
        </TabsList>

        {/* Meetings Tab */}
        <TabsContent value="meetings">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">All Meetings</h2>
              <Button>Create Meeting</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {meetings.length ? meetings.map((meeting, index) => (
                <Card key={index} className="shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{meeting.title}</h3>
                    <p className="text-gray-600">{meeting.date}</p>
                  </CardContent>
                </Card>
              )) : <p className="text-center text-gray-500">No meetings scheduled.</p>}
            </div>
          </motion.div>
        </TabsContent>

        {/* Users Tab */}
        <TabsContent value="users">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
            <h2 className="text-3xl font-semibold mb-6">All Users</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {users.length ? users.map((user, index) => (
                <Card key={index} className="shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                  </CardContent>
                </Card>
              )) : <p className="text-center text-gray-500">No users found.</p>}
            </div>
          </motion.div>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
            <h2 className="text-3xl font-semibold mb-6">Attendance Monitoring</h2>
            <div className="bg-white p-6 rounded-xl shadow-md">
              <p className="text-gray-600">Attendance dashboard and fake detection logic will appear here.</p>
            </div>
          </motion.div>
        </TabsContent>

        {/* Devices Tab */}
        <TabsContent value="devices">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl font-semibold">IoT Device Management</h2>
              <Button>Add Device</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.length ? devices.map((device, index) => (
                <Card key={index} className="shadow-md">
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2">{device.name}</h3>
                    <p className="text-gray-600">Status: {device.status}</p>
                  </CardContent>
                </Card>
              )) : <p className="text-center text-gray-500">No devices configured.</p>}
            </div>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
