'use client';
import SyllabusSidebar from '@/components/syllabusSidebar/syllabusSidebar';
import { Section, Unit } from '@/types';
import { useState } from 'react';
import Markdown from 'react-markdown';
import './syllabus.css';

export default function Syllabus() {
  const [activeUnit, setActiveUnit] = useState<Unit>();

  const mockSections: Section[] = Array.from({ length: 6 }, (_, i) => ({
    id: `section${i + 1}`,
    title: `Section ${i + 1}`,
    units: Array.from({ length: 5 }, (_, j) => ({
      id: `unit${j + 1}`,
      owner: `owner${j + 1}`,
      title: `Unit ${j + 1}`,
      type: `type${j + 1}`,
      markdown_body: `Markdown body ${j + 1}`,
    })),
  }));

  function selectUnit(unit: Unit) {
    setActiveUnit(unit.id !== activeUnit?.id ? unit : undefined);
  }

  return (
    <>
      <section className='flex border-solid w-full border-black h-screen'>
        <div className='flex-grow flex flex-col items-center'>
          <h2>{activeUnit != null ? activeUnit.title : 'Select a unit'}</h2>
          <div className=' self-start max-w-full'>
            <Markdown className='react-markdown'>{`
# Docker
Purpose: It's a way in which you can configure images of the environment and requirements required to run an application. It eliminates all potential dependency errors.

- The main difference between Docker and a Virtual Machine is that containers are lighter as there's a base shared infrastructure layer (that still isolates the dependencies - up to the OS, but not the kernel) .
  ![[Pasted image 20231129080750.png]]

Basic structure of a containerised service:
![[Pasted image 20231129081044.png]]


- Terminology
	- **An image is a snapshot of an environment, and a container runs the software**. Both containers and images allow users to specify application dependencies and configurations and to describe everything necessary for a machine to run that application. However, containers and images have different lifecycles. [^1]
		- An image is the output of the *Dockerfile*, which can in turn generate the container.
		- A container is like a VM running within your machine, but without the OS (therefore much lighter).

[^1]: ['Docker image versus container: What are the differences?' | CircleCI](https://circleci.com/blog/docker-image-vs-container/#:~:text=An%20image%20is%20a%20snapshot,and%20images%20have%20different%20lifecycles)




- Process 
	1. In a Dockerfile you store the config of the environment 
	2. You then compile that file into a Docker image
		- Once an image has been written and registered, it can be summoned from the container registry as follows: 
		\`\`\` bash
		docker ps
		
		# Pick the container id and use it in 
		docker exec -it CONTAINER_ID /bin/bash
		\`\`\`
	1. Which gets mounted on a disk, where the application runs with a controlled environment.
- [Basic removal commands for images, container, and volumes](https://www.digitalocean.com/community/tutorials/how-to-remove-docker-images-containers-and-volumes)
- \`docker-compose.yml\` -> Needs to be called as such.
	- It's a multi-container tool so that you can use a single Docker image to run multiple separate environments, which share the same network.
		- E.g. for *Airflow*, you can create multiple machines for multiple images, which correspond to different nodes in the architecture .
		- You use these mappings to establish shared drives between different containers ![[Pasted image 20221206145259.png]]
	- You first need to build the independent images, and then compose them into a network. E.g.:
		 \`\`\` bash
		docker build -t hadoop-base docker/hadoop/hadoop-base && \
		docker build -t hive-base docker/hive/hive-base && \
		docker build -t spark-base docker/spark/spark-base && \
		docker-compose up -d --build
		\`\`\`




## Source
`}</Markdown>
          </div>
        </div>
        <div className='self-end'>
          <SyllabusSidebar
            activeId={''}
            sections={mockSections}
            courseName='Codeworks'
            selectUnit={selectUnit}
            selectedUnit={activeUnit?.id}
          />
        </div>
      </section>
    </>
  );
}
