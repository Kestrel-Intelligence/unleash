import { InstanceStatsService } from './instance-stats-service';
import {
    createFakeGetActiveUsers,
    createGetActiveUsers,
} from './getActiveUsers';
import {
    createFakeGetProductionChanges,
    createGetProductionChanges,
} from './getProductionChanges';
import type { IUnleashConfig } from '../../types';
import type { Db } from '../../db/db';
import FeatureToggleStore from '../feature-toggle/feature-toggle-store';
import UserStore from '../../db/user-store';
import ProjectStore from '../project/project-store';
import EnvironmentStore from '../project-environments/environment-store';
import StrategyStore from '../../db/strategy-store';
import ContextFieldStore from '../context/context-field-store';
import GroupStore from '../../db/group-store';
import SegmentStore from '../segment/segment-store';
import RoleStore from '../../db/role-store';
import SettingStore from '../../db/setting-store';
import ClientInstanceStore from '../../db/client-instance-store';
import EventStore from '../events/event-store';
import { ApiTokenStore } from '../../db/api-token-store';
import { ClientMetricsStoreV2 } from '../metrics/client-metrics/client-metrics-store-v2';
import VersionService from '../../services/version-service';
import FeatureStrategyStore from '../feature-toggle/feature-toggle-strategies-store';
import FakeUserStore from '../../../test/fixtures/fake-user-store';
import FakeFeatureToggleStore from '../feature-toggle/fakes/fake-feature-toggle-store';
import FakeProjectStore from '../../../test/fixtures/fake-project-store';
import FakeEnvironmentStore from '../project-environments/fake-environment-store';
import FakeGroupStore from '../../../test/fixtures/fake-group-store';
import FakeContextFieldStore from '../context/fake-context-field-store';
import FakeRoleStore from '../../../test/fixtures/fake-role-store';
import FakeClientInstanceStore from '../../../test/fixtures/fake-client-instance-store';
import FakeClientMetricsStoreV2 from '../metrics/client-metrics/fake-client-metrics-store-v2';
import FakeApiTokenStore from '../../../test/fixtures/fake-api-token-store';
import FakeEventStore from '../../../test/fixtures/fake-event-store';
import FakeSettingStore from '../../../test/fixtures/fake-setting-store';
import FakeSegmentStore from '../../../test/fixtures/fake-segment-store';
import FakeStrategiesStore from '../../../test/fixtures/fake-strategies-store';
import FakeFeatureStrategiesStore from '../feature-toggle/fakes/fake-feature-strategies-store';
import { FeatureStrategiesReadModel } from '../feature-toggle/feature-strategies-read-model';
import { FakeFeatureStrategiesReadModel } from '../feature-toggle/fake-feature-strategies-read-model';
import { TrafficDataUsageStore } from '../traffic-data-usage/traffic-data-usage-store';
import { FakeTrafficDataUsageStore } from '../traffic-data-usage/fake-traffic-data-usage-store';
import {
    createFakeGetLicensedUsers,
    createGetLicensedUsers,
} from './getLicensedUsers';

export const createInstanceStatsService = (db: Db, config: IUnleashConfig) => {
    const { eventBus, getLogger, flagResolver } = config;
    const featureToggleStore = new FeatureToggleStore(
        db,
        eventBus,
        getLogger,
        flagResolver,
    );
    const userStore = new UserStore(db, getLogger, flagResolver);
    const projectStore = new ProjectStore(db, eventBus, config);
    const environmentStore = new EnvironmentStore(db, eventBus, config);
    const strategyStore = new StrategyStore(db, getLogger);
    const contextFieldStore = new ContextFieldStore(
        db,
        getLogger,
        flagResolver,
    );
    const groupStore = new GroupStore(db);
    const segmentStore = new SegmentStore(
        db,
        eventBus,
        getLogger,
        flagResolver,
    );
    const roleStore = new RoleStore(db, eventBus, getLogger);
    const settingStore = new SettingStore(db, getLogger);
    const clientInstanceStore = new ClientInstanceStore(
        db,
        eventBus,
        getLogger,
    );
    const eventStore = new EventStore(db, getLogger);
    const apiTokenStore = new ApiTokenStore(
        db,
        eventBus,
        getLogger,
        flagResolver,
    );
    const clientMetricsStoreV2 = new ClientMetricsStoreV2(
        db,
        eventBus,
        getLogger,
        flagResolver,
    );

    const featureStrategiesReadModel = new FeatureStrategiesReadModel(db);

    const trafficDataUsageStore = new TrafficDataUsageStore(db, getLogger);

    const featureStrategiesStore = new FeatureStrategyStore(
        db,
        eventBus,
        getLogger,
        flagResolver,
    );
    const instanceStatsServiceStores = {
        featureToggleStore,
        userStore,
        projectStore,
        environmentStore,
        strategyStore,
        contextFieldStore,
        groupStore,
        segmentStore,
        roleStore,
        settingStore,
        clientInstanceStore,
        eventStore,
        apiTokenStore,
        clientMetricsStoreV2,
        featureStrategiesReadModel,
        featureStrategiesStore,
        trafficDataUsageStore,
    };
    const versionServiceStores = { settingStore };
    const getActiveUsers = createGetActiveUsers(db);
    const getProductionChanges = createGetProductionChanges(db);
    const getLicencedUsers = createGetLicensedUsers(db);
    const versionService = new VersionService(versionServiceStores, config);

    const instanceStatsService = new InstanceStatsService(
        instanceStatsServiceStores,
        config,
        versionService,
        getActiveUsers,
        getProductionChanges,
        getLicencedUsers,
    );

    return instanceStatsService;
};

export const createFakeInstanceStatsService = (config: IUnleashConfig) => {
    const { eventBus, getLogger, flagResolver } = config;
    const featureToggleStore = new FakeFeatureToggleStore();
    const userStore = new FakeUserStore();
    const projectStore = new FakeProjectStore();
    const environmentStore = new FakeEnvironmentStore();
    const strategyStore = new FakeStrategiesStore();
    const contextFieldStore = new FakeContextFieldStore();
    const groupStore = new FakeGroupStore();
    const segmentStore = new FakeSegmentStore();
    const roleStore = new FakeRoleStore();
    const settingStore = new FakeSettingStore();
    const clientInstanceStore = new FakeClientInstanceStore();
    const eventStore = new FakeEventStore();
    const apiTokenStore = new FakeApiTokenStore();
    const clientMetricsStoreV2 = new FakeClientMetricsStoreV2();
    const featureStrategiesReadModel = new FakeFeatureStrategiesReadModel();
    const trafficDataUsageStore = new FakeTrafficDataUsageStore();
    const featureStrategiesStore = new FakeFeatureStrategiesStore();
    const instanceStatsServiceStores = {
        featureToggleStore,
        userStore,
        projectStore,
        environmentStore,
        strategyStore,
        contextFieldStore,
        groupStore,
        segmentStore,
        roleStore,
        settingStore,
        clientInstanceStore,
        eventStore,
        apiTokenStore,
        clientMetricsStoreV2,
        featureStrategiesReadModel,
        featureStrategiesStore,
        trafficDataUsageStore,
    };

    const versionServiceStores = { settingStore };
    const getActiveUsers = createFakeGetActiveUsers();
    const getLicensedUsers = createFakeGetLicensedUsers();
    const getProductionChanges = createFakeGetProductionChanges();
    const versionService = new VersionService(versionServiceStores, config);

    const instanceStatsService = new InstanceStatsService(
        instanceStatsServiceStores,
        config,
        versionService,
        getActiveUsers,
        getProductionChanges,
        getLicensedUsers,
    );

    return instanceStatsService;
};
