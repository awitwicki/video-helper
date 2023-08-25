import { Component } from "preact";

interface TimeSpanInputComponentProps {
    onChange: (input: string, isValid: boolean) => void;
}

interface TimeSpanInputComponentState {
    input: string;
    isValid: boolean;
}

class TimeSpanInput extends Component<TimeSpanInputComponentProps, TimeSpanInputComponentState> {
    private regex= /^(?:(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d|\d+):[0-5]\d:[0-5]\d$/
    
    constructor(props: TimeSpanInputComponentProps) {
        super(props)
        this.state = {
            input: '',
            isValid: true
        }
    }
    
    handleTrimFromChange = (event: Event) => {
        const input = (event.target as HTMLInputElement).value;
        const isValid = input ? this.regex.test(input) : true

        this.setState({ input, isValid });
        this.props.onChange(input, isValid);
    };

    render() {
        const { input } = this.state;

        return (
            <input
                type="text"
                className={`bg-white appearance-none border-2 border-gray-200 rounded w-full py-2 px-4 text-gray-700 leading-tight ${
                    this.state.isValid ? '' : 'border-red-500'
                }`}
                placeholder="HH:MM:SS"
                value={input}
                onChange={this.handleTrimFromChange}
            />
        );
    }
}

export default TimeSpanInput;
