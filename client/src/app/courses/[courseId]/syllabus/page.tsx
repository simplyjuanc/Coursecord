"use client";
import SyllabusSidebar from "@/components/syllabusSidebar/syllabusSidebar";
import { Section, Unit } from "@/types";
import { useState } from "react";
import Markdown from "react-markdown";
import MarkdownStyle from "./syllabus.module.css";

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
      <section className="flex flex-grow flex-row border-solid border-black h-screen">
        <div className="w-[60vw]">
          <div className="react-markdown px-32 mx-auto">
            <Markdown className={MarkdownStyle.markdown}>
              {`
# Docs @ Docker


Welcome to the Docker Documentation repository. This is the source for
[https://docs.docker.com/](https://docs.docker.com/).

Feel free to send us pull requests and file issues. Our docs are completely
open source, and we deeply appreciate contributions from the Docker community!

## Provide feedback

We’d love to hear your feedback. Please file documentation issues only in the
Docs GitHub repository. You can file a new issue to suggest improvements or if
you see any errors in the existing documentation.

Before submitting a new issue, check whether the issue has already been
reported. You can join the discussion using an emoji, or by adding a comment to
an existing issue. If possible, we recommend that you suggest a fix to the issue
by creating a pull request.

You can ask general questions and get community support through the [Docker
Community Slack](https://dockr.ly/comm-slack). Personalized support is available
through the Docker Pro, Team, and Business subscriptions. See [Docker
Pricing](https://www.docker.com/pricing) for details.

If you have an idea for a new feature or behavior change in a specific aspect of
Docker or have found a product bug, file that issue in the project's code
repository.

We've made it easy for you to file new issues.

- Click **[New issue](https://github.com/docker/docs/issues/new)** on the docs repository and fill in the details, or
- Click **Request docs changes** in the right column of every page on
  [docs.docker.com](https://docs.docker.com/) and add the details, or

  ![Request changes link](/static/assets/images/docs-site-feedback.png)

- Click the **Give feedback** link on the side of every page in the docs.

  ![Docs feedback on each page](/static/assets/images/feedback-widget.png)

## Contribute to Docker docs

We value your contribution. We want to make it as easy as possible to submit
your contributions to the Docker docs repository. Changes to the docs are
handled through pull requests against the main branch. To learn how towwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwtowwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww
contribute, see our [Contribute section](https://docs.docker.com/contribute/overview/).

## Copyright and license

Copyright 2013-2023 Docker, Inc., released under the <a href="https://github.com/docker/docs/blob/main/LICENSE">Apache 2.0 license</a> .


`}
            </Markdown>
          </div>
        </div>
        <div className="self-end fixed right-0">
          <SyllabusSidebar
            activeId={""}
            sections={mockSections}
            courseName="Codeworks"
            selectUnit={selectUnit}
            selectedUnit={activeUnit?.id}
          />
        </div>
      </section>
    </>
  );
}
