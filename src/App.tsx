import React from 'react';

interface Param {
  id: number;
  name: string;
  type: 'string';
}
interface ParamValue {
  paramId: number;
  value: string;
}
interface Model {
  paramValues: ParamValue[];
  colors: Color[];
}

interface Color {} 

interface Props {
  params: Param[];
  model: Model;
}
interface State {
  values: Record<number, string>; 
}

class ParamEditor extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const initialValues = props.params.reduce((acc, param) => {
      const paramValue = props.model.paramValues.find(pv => pv.paramId === param.id);
      acc[param.id] = paramValue?.value || '';
      return acc;
    }, {} as Record<number, string>);

    this.state = {
      values: initialValues,
    };
  }

  private handleChange = (paramId: number, value: string) => {
    this.setState(prvState => ({
      values: {
        ...prvState.values,
        [paramId]: value,
      },
    }));
  };

  public getModel(): Model {
    return {
      ...this.props.model,
      paramValues: this.props.params.map(param => ({
        paramId: param.id,
        value: this.state.values[param.id] || '',
      })),
    };
  }

  private renderParamInput = (param: Param) => {
    return (
      <div key={param.id} style={{ marginBottom: '10px', display:'flex', alignItems: 'center'}}>
        <label style={{ width: '100px', marginRight: '10px' }}>{param.name}</label>
        <input
          type="text"
          value={this.state.values[param.id] || ''}
          onChange={(e) => this.handleChange(param.id, e.target.value)}
          style={{ flex: 1, padding: '5px'}}
        />
      </div>
    );
  };
  render() {
    return (
      <div style={{ maxWidth: '400px', margin: '20px' }}>
        {this.props.params.map(this.renderParamInput)}
      </div>
    );
  }
}

// Пример использования
const App: React.FC = () => {
  const params: Param[] = [
    { id: 1, name: 'Назначение', type: 'string' },
    { id: 2, name: 'Длина', type: 'string' },
  ];

  const model: Model = {
    paramValues: [
      { paramId: 1, value: 'повседневное' },
      { paramId: 2, value: 'макси' },
    ],
    colors: [],
  };

  const paramEditorRef = React.useRef<ParamEditor>(null);

  const handleGetModel = () => {
    if (paramEditorRef.current) {
      const model = paramEditorRef.current.getModel();
      console.log('Current Model:', model);
    }
  };

  return (
    <div>
      <h1>Редактор параметров</h1>
      <ParamEditor ref={paramEditorRef} params={params} model={model} />
      <button onClick={handleGetModel} style={{ marginTop: '20px', padding: '10px',background :'blue', color:'white' }}>
        Получить модель
      </button>
    </div>
  );
};

export default App;