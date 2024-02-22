import {memo} from 'react';
import Box from "@cloudscape-design/components/box";

const Label = memo(({ label, children }) => {
    return (
            <div>
                <Box variant="awsui-key-label">{label}</Box>
                <div>{children}</div>
            </div>
           );
});

export default Label;
