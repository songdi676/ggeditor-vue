export interface EditorContextProps {
  graph: G6.Graph | null;
  executeCommand: (name: string, params?: object) => void;
}

export interface EditorPrivateContextProps {
  setGraph: (graph: G6.Graph) => void;
}
