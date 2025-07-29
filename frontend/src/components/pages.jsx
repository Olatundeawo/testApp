import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CilentCam from "./cilentCam";
import Instruction from "./instructions";
import Test from "./test";
import TestPost from "./testPost";
import QuestionPost from "./questionPost";
import AnswerPost from "./answerPost";
import TestChange from "./testChange";
import Notfound from "./Notfound";

function Page() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Instruction />} />
          <Route path="/cam" element={<CilentCam />} />
          <Route path="/test" element={<Test />} />
          <Route path="/addtest" element={<TestPost />} />
          <Route path="/addquestion" element={<QuestionPost />} />
          <Route path="/addanswer" element={<AnswerPost />} />
          <Route path="/testchange" element={<TestChange />} />
          <Route path="*" element={<Notfound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default Page;
