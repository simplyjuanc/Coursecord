import React from 'react'
import Image from "next/image";
import { THelpRequest } from '@/types';
import { formatDistanceToNow } from 'date-fns';


export default function ItemComponent({item}: {item:THelpRequest}) {
  return (
    <div className="border-primary-red border-2 rounded-xl select-none">
      <div className="p-2">
        <div className="flex">
          <div className="my-auto">
            <Image
              src={item.students[0].image ?? ""}
              alt={""}
              width={30}
              height={30}
              className="object-contain rounded-full mr-1"
            />
          </div>
          <h1 className="text-xl font-semibold my-auto">
            {item.students[0].name}
          </h1>
        </div>
        <h2 className="py-2 font-medium">{item.content}</h2>
        {item.instructor && (
          <div className="flex">
            <Image
              src={item.instructor.image ?? ""}
              alt={""}
              width={25}
              height={25}
              className="object-contain rounded-full mr-1 my-auto"
            />
            <h1 className="my-auto text-lg font-medium">
              {item.instructor.name}
            </h1>
          </div>
        )}
        <div>
          <h3 className="">
            {item.finished_at === null
              ? formatDistanceToNow(new Date(item.created_at), {
                  addSuffix: true,
                })
              : "finished " +
                formatDistanceToNow(new Date(item.finished_at), {
                  addSuffix: true,
                })}
          </h3>
        </div>
      </div>
    </div>
  );
};
