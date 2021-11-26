class Internal::CheckNewVersionsJob < ApplicationJob
  queue_as :scheduled_jobs

  def perform
    return unless Rails.env.production?

    latest_version = MaasHub.latest_version
    return unless latest_version

    ::Redis::Alfred.set(::Redis::Alfred::LATEST_MAAS_VERSION, latest_version)
  end
end
