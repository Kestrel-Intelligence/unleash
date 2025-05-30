import { Fragment, type VFC } from 'react';
import type {
    PlaygroundConstraintSchema,
    PlaygroundRequestSchema,
} from 'openapi';
import { objectId } from 'utils/objectId';
import { ConditionallyRender } from 'component/common/ConditionallyRender/ConditionallyRender';
import { StrategySeparator } from 'component/common/StrategySeparator/LegacyStrategySeparator';
import { styled } from '@mui/material';
import { ConstraintAccordionView } from 'component/common/LegacyConstraintAccordion/ConstraintAccordionView/ConstraintAccordionView';
import { ConstraintError } from './ConstraintError/LegacyConstraintError';
import { ConstraintOk } from './ConstraintOk/LegacyConstraintOk';

interface IConstraintExecutionProps {
    constraints?: PlaygroundConstraintSchema[];
    input?: PlaygroundRequestSchema;
}

export const ConstraintExecutionWrapper = styled('div')(() => ({
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

export const ConstraintExecution: VFC<IConstraintExecutionProps> = ({
    constraints,
    input,
}) => {
    if (!constraints) return null;

    return (
        <ConstraintExecutionWrapper>
            {constraints?.map((constraint, index) => (
                <Fragment key={objectId(constraint)}>
                    <ConditionallyRender
                        condition={index > 0}
                        show={<StrategySeparator text='AND' />}
                    />
                    <ConstraintAccordionView
                        constraint={constraint}
                        compact
                        renderAfter={
                            <ConditionallyRender
                                condition={constraint.result}
                                show={<ConstraintOk />}
                                elseShow={
                                    <ConstraintError
                                        input={input}
                                        constraint={constraint}
                                    />
                                }
                            />
                        }
                    />
                </Fragment>
            ))}
        </ConstraintExecutionWrapper>
    );
};
