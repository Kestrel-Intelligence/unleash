import { Link, List, ListItem, styled, Typography } from '@mui/material';
import { useStrategies } from 'hooks/api/getters/useStrategies/useStrategies';
import { ConditionallyRender } from 'component/common/ConditionallyRender/ConditionallyRender';
import { useReleasePlanTemplates } from 'hooks/api/getters/useReleasePlanTemplates/useReleasePlanTemplates';
import type { IReleasePlanTemplate } from 'interfaces/releasePlans';
import { useNavigate } from 'react-router-dom';
import { OldFeatureStrategyMenuCard } from '../FeatureStrategyMenuCard/OldFeatureStrategyMenuCard';
import { OldFeatureReleasePlanCard } from '../FeatureReleasePlanCard/OldFeatureReleasePlanCard';

interface IFeatureStrategyMenuCardsProps {
    projectId: string;
    featureId: string;
    environmentId: string;
    onlyReleasePlans: boolean;
    onAddReleasePlan: (template: IReleasePlanTemplate) => void;
}

const StyledTypography = styled(Typography)(({ theme }) => ({
    fontSize: theme.fontSizes.smallBody,
    padding: theme.spacing(1, 2),
}));

const StyledLink = styled(Link)(({ theme }) => ({
    fontSize: theme.fontSizes.smallBody,
    cursor: 'pointer',
})) as typeof Link;

export const OldFeatureStrategyMenuCards = ({
    projectId,
    featureId,
    environmentId,
    onlyReleasePlans,
    onAddReleasePlan,
}: IFeatureStrategyMenuCardsProps) => {
    const { strategies } = useStrategies();
    const { templates } = useReleasePlanTemplates();
    const navigate = useNavigate();
    const allStrategies = !onlyReleasePlans;

    const preDefinedStrategies = strategies.filter(
        (strategy) => !strategy.deprecated && !strategy.editable,
    );

    const customStrategies = strategies.filter(
        (strategy) => !strategy.deprecated && strategy.editable,
    );

    const defaultStrategy = {
        name: 'flexibleRollout',
        displayName: 'Default strategy',
        description:
            'This is the default strategy defined for this environment in the project',
    };
    return (
        <List dense>
            {allStrategies ? (
                <>
                    <StyledTypography color='textSecondary'>
                        Default strategy for {environmentId} environment
                    </StyledTypography>
                    <ListItem key={defaultStrategy.name}>
                        <OldFeatureStrategyMenuCard
                            projectId={projectId}
                            featureId={featureId}
                            environmentId={environmentId}
                            strategy={defaultStrategy}
                            defaultStrategy={true}
                        />
                    </ListItem>
                </>
            ) : null}
            <ConditionallyRender
                condition={templates.length > 0}
                show={
                    <>
                        <StyledTypography color='textSecondary'>
                            Release templates
                        </StyledTypography>
                        {templates.map((template) => (
                            <ListItem key={template.id}>
                                <OldFeatureReleasePlanCard
                                    template={template}
                                    onClick={() => onAddReleasePlan(template)}
                                />
                            </ListItem>
                        ))}
                    </>
                }
            />
            <ConditionallyRender
                condition={templates.length === 0 && onlyReleasePlans}
                show={
                    <>
                        <StyledTypography
                            color='textSecondary'
                            sx={{
                                padding: (theme) => theme.spacing(1, 2, 0, 2),
                            }}
                        >
                            <p>No templates created.</p>
                            <p>
                                Go to&nbsp;
                                <StyledLink
                                    onClick={() =>
                                        navigate('/release-templates')
                                    }
                                >
                                    Release templates
                                </StyledLink>
                                &nbsp;to get started
                            </p>
                        </StyledTypography>
                    </>
                }
            />
            {allStrategies ? (
                <>
                    <StyledTypography color='textSecondary'>
                        Predefined strategy types
                    </StyledTypography>
                    {preDefinedStrategies.map((strategy) => (
                        <ListItem key={strategy.name}>
                            <OldFeatureStrategyMenuCard
                                projectId={projectId}
                                featureId={featureId}
                                environmentId={environmentId}
                                strategy={strategy}
                            />
                        </ListItem>
                    ))}
                    <ConditionallyRender
                        condition={customStrategies.length > 0}
                        show={
                            <>
                                <StyledTypography color='textSecondary'>
                                    Custom strategies
                                </StyledTypography>
                                {customStrategies.map((strategy) => (
                                    <ListItem key={strategy.name}>
                                        <OldFeatureStrategyMenuCard
                                            projectId={projectId}
                                            featureId={featureId}
                                            environmentId={environmentId}
                                            strategy={strategy}
                                        />
                                    </ListItem>
                                ))}
                            </>
                        }
                    />
                </>
            ) : null}
        </List>
    );
};
