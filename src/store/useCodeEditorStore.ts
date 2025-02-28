import {create} from "zustand"
import { Monaco } from "@monaco-editor/react"
import { LANGUAGE_CONFIG } from "@/app/(root)/_constants"
import { CodeEditorState } from "@/types/index"

const getInitialState = ()=>{
  //if we are on server side, return default value
  if(typeof window === "undefined"){
    return {
      language:"javascript",
      fontSize: 16,
      theme:"vs-dark",
    }
  }
  // if we are on the client return values from local storage
  const savedLanguage = localStorage.getItem("editor-language")||"javascript";
  const savedTheme = localStorage.getItem("editor-theme") ||"vs-dark";
  const savedFontSize = localStorage.getItem("editor-font-size") ||16;
  return{
    language: savedLanguage,
    theme: savedTheme,
    fontSize: Number(savedFontSize),
  }
}

export const useCodeEditorStore = create<CodeEditorState>((set,get) =>{
  const initialState = getInitialState();
  return {
    ...initialState,
    output: "",
    isRunning: false,
    error:null,
    editor:null,
    executionResult:null,

    getCode:()=> get().editor?.getValue()||"",
    setEditor:(editor:Monaco) =>{
      const savedCode = localStorage.getItem(`editor-code-${get().language}`)
      if(savedCode) editor.setValue(savedCode);
      set({editor});
    },
    setTheme:(theme:string)=>{
      localStorage.setItem("editor-theme",theme);
      set({theme});
    },
    setFontSize:(fontSize:number)=>{
      localStorage.setItem("editor-font-size",fontSize.toString());
      set({fontSize});
    },
    setLanguage: (language: string) => {
      // Save current language code before switching
      const currentCode = get().editor?.getValue();
      if (currentCode) {
        localStorage.setItem(`editor-code-${get().language}`, currentCode);
      }

      localStorage.setItem("editor-language", language);

      set({
        language,
        output: "",
        error: null,
      });
    },
    runCode: async() =>{
      //To Let
    }
  }
})
