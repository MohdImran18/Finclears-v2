"use client";

import { useParams } from "next/navigation";

import { useUser } from "@/hooks/useUsers";

import UserStatus from "@/components/users/UserStatus";

export default function UserDetailsPage(){

    const {id}=useParams();

    const {

        data,

        isLoading,

    }=useUser(Number(id));

    if(isLoading){

        return <>Loading...</>;

    }

    if(!data){

        return <>User not found.</>;

    }

    return(

        <div className="rounded-xl bg-white p-8 shadow">

            <h1 className="text-3xl font-bold">

                {data.name}

            </h1>

            <div className="mt-6 space-y-3">

                <p>

                    <strong>Email:</strong>

                    {" "}

                    {data.email}

                </p>

                <p>

                    <strong>Phone:</strong>

                    {" "}

                    {data.phone}

                </p>

                <p>

                    <strong>Role:</strong>

                    {" "}

                    {data.role}

                </p>

                <p>

                    <strong>Status:</strong>

                    {" "}

                    <UserStatus
                        status={data.status}
                    />

                </p>

            </div>

        </div>

    );

}